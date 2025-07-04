import jwt from "jsonwebtoken";

export const generateToken = (res, userID) => {
  if (!userID) {
    throw new Error("userID not provided");
  }
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // prevent access from JS
    secure: process.env.NODE_ENV === "production", // ✅ true if HTTPS, false for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};
