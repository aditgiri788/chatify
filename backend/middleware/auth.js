//middleware is the function that is excecuted before executing the controlers function
import User from "../models/user.js"

//middleware to protect route
//here just finding the user by the help of token
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");

    //basically from the token we find all the details of the user accept password
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({success:false, message:"error.message"})
    
  }
};
