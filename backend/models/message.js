import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    file: { type: String },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Correct model creation
const Message = mongoose.model("Message", messageSchema);
export default Message;
