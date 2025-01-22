import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

export const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Multer failed to process file." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ error: "Image upload failed." });
          }
          res.json({ secure_url: result.secure_url });
        }
      );

      stream.end(req.file.buffer);
    } catch (error) {
      console.error("Error in image upload:", error.message);
      res.status(500).json({ error: "Image upload failed." });
    }
  });
};
