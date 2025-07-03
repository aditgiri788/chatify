//function to genrate the token
import jwt from "jsonwebtoken";

export const generateToken = (userID) => {
//using this userId we will generate a new token
const token=jwt.sign({userID}, process.env.JWT_SECRET);
return token;

};

//fucion to token geting object id of the user

