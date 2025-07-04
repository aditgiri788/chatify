//middleware is the function that is excecuted before executing the controlers function
import User from "../models/user.js";
import jwt from "jsonwebtoken";

//middleware to protect route
//here just finding the user by the help of token
export const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userID } = decoded;
    if (!userID) return res.status(401).json({ message: "unauthorized" });

    const user = await User.findById(decoded.userID).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "unauthorized" });
  }
};
