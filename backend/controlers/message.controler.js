import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except logged-in user
export const getUsersforSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filterUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unSeenMessage = {};
    await Promise.all(
      filterUsers.map(async (user) => {
        const messages = await Message.find({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });
        if (messages.length > 0) {
          unSeenMessage[user._id] = messages.length;
        }
      })
    );

    return res.json({ success: true, users: filterUsers, unSeenMessage });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

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

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
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

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id; // Assuming your route uses ':id'
    const senderId = req.user._id;

    let imgUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imgUrl,
    });

    // Emit new message to receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
