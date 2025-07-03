import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: { type: String, required: true, default: "" }, //here we will store url of the profile picture
  bio: { type: String },
},{timestamps:true});  //this will add the time when the user was created

const User=mongoose.model("User", userSchema);
export default User;
