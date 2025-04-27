import { Request, Response } from "express";
import Goal from "../schemas/goalSchema";
import { connectDB } from "../lib/mongoDB_setup";

class GoalManagement {
  public static async SetGoal(req: Request, res: Response): Promise<void> {
    const { userId, goals } = req.body;

    if (!userId || !Array.isArray(goals)) {
      res.status(400).json({ message: "userId and goals are required" });
      return;
    }

    try {
      await connectDB();

      const createdGoal = await Goal.create({
        userId,
        goals,
      });

      res.status(201).json({
        message: "Goal successfully set",
        data: createdGoal,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error has occurred" });
    }
  }

  public static async getGoals(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId as string;
  
    if (!userId) {
      res.status(400).json({ message: "Missing userId in query parameters" });
      return;
    }
  
    try {
      await connectDB();
  
      const userGoals = await Goal.find({ userId });
  
      if (!userGoals) {
        res.status(404).json({ message: "No goals found for this user" });
        return;
      }
  
      res.status(200).json({ message: "Goals fetched successfully", data: userGoals });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred while fetching goals" });
    }
  }
  
}

export default GoalManagement;
