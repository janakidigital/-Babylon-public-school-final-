const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  fileBuffer,
  folder,
  mimetype = "image/jpeg"
) => {
  return new Promise((resolve, reject) => {
    let resourceType = "image";

    if (mimetype === "application/pdf") {
      resourceType = "image";
    } else if (mimetype.startsWith("image/")) {
      resourceType = "image";
    } else {
      return reject(
        new Error(`Unsupported file type: ${mimetype}`)
      );
    }

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
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        console.log("Cloudinary upload successful:", {
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