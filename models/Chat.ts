import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  title: String,

  // ✅ ADD THIS
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);