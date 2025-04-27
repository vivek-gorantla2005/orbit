import mongoose, { Schema } from 'mongoose';

const goalSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  goals: [
    {
      name: {
        type: String,
        required: true,
      },
      progress: {
        type: Number,
        default: 0.0,
        min: 0.0,
        max: 1.0,
      }
    }
  ]
});

const Goal = mongoose.models.goalSchema||mongoose.model('Goal', goalSchema);
export default Goal;
