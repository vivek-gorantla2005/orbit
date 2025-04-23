import mongoose, { Schema } from "mongoose";

const uploadSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  fileName: String,
  filePath: String,
  fileType: {
    type: String,
    required: true,
  },
  fileSize: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  analytics: {
    type: Schema.Types.Mixed,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending","completed","failed"],
    default: "pending",
  },
});

const UploadModel = mongoose.models.upload || mongoose.model("upload", uploadSchema);

export default UploadModel;
