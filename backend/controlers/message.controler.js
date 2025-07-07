import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";
import { uploadStream } from "../services/cloudinary.service.js";


// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { receiverId: myId, senderId: selectedUserId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as seen by ID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, fileType="unknown" } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const file = req.file; 

    if(!file && !text) return res.status(400).json({message: "content missing"});
    console.log({file});
    let url = null;
    let fileName = null;
    if (file) {
      // Use your uploadStream method with file buffer
      const { secure_url } = await uploadStream(file, "chat_app",);
      url = secure_url;
      fileName = file.originalname;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      file: url,
      fileType,
      fileName,
    });

    // Emit new message to receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ 
      success: true, 
      message: "Message sent successfully",
      newMessage 
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message",
      error: error.message 
    });
  }
};
