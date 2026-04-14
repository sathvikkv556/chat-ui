import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: String,
  role: String,
  content: String,
  timestamp: String,
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);