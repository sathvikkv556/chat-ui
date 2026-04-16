import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: String,

  // ✅ ADD THIS
  userId: {
    type: String,
    required: true,
  },

  content: String,
  role: String,
  timestamp: String,
});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);