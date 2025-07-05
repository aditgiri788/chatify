import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/"];
    const isValid = allowedTypes.some((type) => file.mimetype.startsWith(type));
    if (!isValid) {
      return cb(new Error("Only images and videos are allowed"), false);
    }

    cb(null, true);
  },
});

export const handlefileUpload = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };
};
