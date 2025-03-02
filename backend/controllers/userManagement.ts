import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from '../lib/prismaSetup';
import redis from '../lib/redisSetup';
import dotenv from "dotenv";

dotenv.config();

interface CustomUser {
  username?: string;
  email: string;
  password: string;
  token?: string;
}

interface retrievedUser {
  profilePic? : String;
  username?:String
  bio?:String;
  followers?:number;
  following?:number;
  postCount?:number;
  badges?:object;
  likenessScore?:number;
}

class UserManagement {
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password }: CustomUser = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        res.status(400).json({
          message: existingUser.email === email
            ? "User with this email already exists"
            : "Username is already taken",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      const bearerToken = `Bearer ${token}`;

      await redis.set(`session:${newUser.id}`, bearerToken, "EX", 604800);
      await redis.set(`user:${newUser.id}`, JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }), "EX", 604800);
      
      await prisma.user.update({
        where: { id: newUser.id },
        data: { token: bearerToken },
      });

      res.status(201).json({
        message: "User registered successfully",
        token: bearerToken,
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
      });

    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).json({ message: "Username or email already exists" });
        return;
      }
      console.error("Error in signUp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: CustomUser = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      const bearerToken = `Bearer ${token}`;

      await redis.set(`session:${user.id}`, bearerToken, "EX", 604800);
      await prisma.user.update({ where: { id: user.id }, data: { token: bearerToken } });

      res.status(200).json({
        message: "Login successful",
        token: bearerToken,
        user: { id: user.id, username: user.username, email: user.email },
      });

    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


  static async getUsers(req:Request, res:Response):Promise<void>{
    const token = req.headers.authorization;
    const {userId} = req.query;
    if(!token){
      res.json({message:"user id not found"});
      return;
    }

    const user = await prisma.user.findFirst({
      where:{id:userId as string}
    })

    const retrievedUser : retrievedUser = {
      profilePic:user?.profilePic||"",
      username:user?.username||"",
      bio:user?.bio||"",
      followers:user?.followers,
      following:user?.following,
      postCount:user?.postCount??0,
      badges:(typeof user?.badges==="object" && user.badges!=null ? user.badges:{}) as object,
      likenessScore:user?.likenessScore??0
    }
    if(user){
      res.json({message:"user returned", retrievedUser})
      return;
    }else{
      res.json({message:"user not found"})
      return;
    }
  }

  static async autocomplete(req:Request, res: Response):Promise<void> {
    try{
      const {query}= req.query;
      if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Query parameter is required" });
        return;
      }

      const users = await prisma.user.findMany({
        where:{
          username:{
            contains:query,
            mode:"insensitive"
          }
        },
        select:{
          id:true,
          username:true
        },take:10
      })
      
      res.json({message:"users returned", users});
      return;

    }catch(err){
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}

export default UserManagement;
