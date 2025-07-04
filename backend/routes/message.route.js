import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { getMessages, markMessageAsSeen, sendMessage } from "../controlers/message.controler.js"
import { handlefileUpload } from "../middleware/multer.middleware.js";


const messageRouter=express.Router();

messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, handlefileUpload("file"), sendMessage);


export default messageRouter;