const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  fileBuffer,
  folder,
  mimetype = "image/jpeg"
) => {
  return new Promise((resolve, reject) => {
    let resourceType = "auto";
    
    if (mimetype === "application/pdf") {
      resourceType = "image";
    } else if (mimetype && (mimetype.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(mimetype))) {
      resourceType = "image";
    } else if (mimetype && (mimetype.startsWith("video/") || /\.(mp4|mkv|mov|avi|wmv|webm|flv|m4v|3gp|ogv)$/i.test(mimetype))) {
      resourceType = "video";
    } else {
      resourceType = "auto";
    }

    console.log(`📤 Uploading: ${mimetype} -> resource_type: ${resourceType}`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }

        console.log("✅ Cloudinary upload successful:", {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
        });

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadToCloudinary,
};