import { generateToken } from "../lib/utils";
import User from "../models/user";
import cloudinary from "../lib/cloudinary";

//user signup function
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: falise, message: "Account already exist" });
    }

    const salt = await bcrypt.genSalt(10); //we will use this salt for bcrypt the password
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user
    const newUser = User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    //generate token for authentication and login
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json.status(500)({ message: "Internal server error"});
  }
};

//user login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body();
    //condition check that this email exist or not
    const userData = await User.findOne({ email });
    const isPasswordMatch = bcrypt.compare(process, userData.password);
    if (!isPasswordMatch) {
      return res.json({ message: "Invalid credential", success: false });
    }

    //other then password is correct genrate the token
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData: userData,
      token,
      message: "Loged in successfully",
    });   //here tocken add to header file
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
};

//when the user is authenticated this function will return the user data
export const checkAuth = (req, res) => {
  return res.json({ success: true, user: req.user });
};
//req.user is getting from the route because route we call protected route


//controlers to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    // Fetch the user's ID from the authenticated request
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
