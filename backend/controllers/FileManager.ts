import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import path from 'path';
import { connectDB } from '../lib/mongoDB_setup';
import UploadModel from '../schemas/uploadSchema';

cloudinary.config({
  cloud_name: "dx1rpbut6",
  api_key: "256968139267437",
  api_secret: "Z9e1Mj6urDaE8XRdoKpWlE0aTlM",
  secure: true,
  cdn_subdomain: true,
});

export default class FileManager {
  public static async uploadFileCloudinary(req: Request, res: Response): Promise<void> {
    const files = (req as any).files;
    const userId = req.body.userId || "anonymous";

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      res.status(500).json({ message: 'Failed to connect to database' });
      return;
    }

    const fileQueue: { filePath: string; fileMeta: any; retry: number }[] = [];
    const sentFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const filePath = path.resolve(files[i].path);
      fileQueue.push({ filePath, fileMeta: files[i], retry: 0 });
    }

    while (fileQueue.length > 0) {
      const current = fileQueue.pop();
      if (!current) continue;

      const { filePath, fileMeta, retry } = current;

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });

        const upload = await UploadModel.create({
          userId: userId,
          fileName: result.original_filename,
          filePath: result.secure_url,
          fileType: result.format,
          fileSize: result.bytes,
        });

        console.log('File uploaded to DB:', upload);
        sentFiles.push(result.secure_url);

        fs.unlinkSync(filePath);
      } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (retry < 3) {
          fileQueue.push({ filePath, fileMeta, retry: retry + 1 });
        } else {
          console.error(`Upload failed after 3 retries: ${filePath}`);
          res.status(500).json({ message: 'Upload failed for some files', error });
          return;
        }
      }
    }

    res.status(200).json({ message: 'Upload successful', urls: sentFiles });
  }
}
