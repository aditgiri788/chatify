import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcrypt";
import { deleteImage, uploadStream } from "../services/cloudinary.service.js";

//user signup function
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exist" });
    }

    const salt = await bcrypt.genSalt(10); //we will use this salt for bcrypt the password
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    //generate token for authentication and login
    generateToken(res, newUser._id);
    res.status(201).json({
      userData: newUser,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //condition check that this email exist or not
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({message: `user ${email} not found`});
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.json({ message: "Invalid credential", success: false });
    }

    //other then password is correct genrate the token
    const token = generateToken(res, user._id);
    res.status(200).json({
      success: true,
      user: user,
      message: "Loged in successfully",
    }); //here tocken add to header file
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

//when the user is authenticated this function will return the user data
export const checkAuth = (req, res) => {
  return res.status(200).json({ user: req.user });
};


export const updateProfile = async (req, res) => {
  try {
    const { bio, fullName } = req.body;
    const { user } = req;
    const file = req.file;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let updateData = { bio, fullName };

    // Handle file upload if present
    if (file) {
      // Remove old avatar if exists
      if (user.profilePic) {
        await deleteImage(user.profilePic);
      }

      // Upload new profile picture
      const folder = `user_profiles/${user._id}`;
      const { secure_url } = await uploadStream(file, folder);
      updateData.profilePic = secure_url;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({ 
      success: true,
      user: updatedUser,
      message: file ? "Profile updated with new picture" : "Profile updated"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update profile" 
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const getAllUsers = async (req, res) => {
  const {_id} = req.user 
  try {
    const users = await User.find({
      _id: {$ne: _id}
    }, "-password"); // ✅ add await
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to fetch all users" });
  }
};
