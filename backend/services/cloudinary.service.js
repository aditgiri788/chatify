import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary.js";

export const uploadStream = (file, folder = "default_folder") => {
  const buffer = file.buffer;
  const mimetype = file.mimetype || "application/octet-stream";
  const originalname = file.originalname;

  return new Promise((resolve, reject) => {
    const isRaw = mimetype.startsWith("application/") || mimetype.startsWith("text/");
    const extension = originalname.split('.').pop();
    const baseName = originalname.replace(/\.[^/.]+$/, ""); // remove extension

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        unique_filename: false,
        public_id: `${baseName}.${extension}`, // 👈 include extension here
        resource_type: isRaw ? "raw" : "auto",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


const extractPublicIdFromUrl = (url) => {
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
};

export const deleteImage = async (imageUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    if(!publicId) {
      throw new Error("Invalid image URL");
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};



