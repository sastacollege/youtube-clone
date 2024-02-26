import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEYS,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

let uploadOnCloudanary = async (localFilePath) => {
  try {
    if (!localFilePath) return next();

    await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return Response.url;

    console.log("File Uploaded Successfully on Cloudinary");
  } catch (error) {
    //REMOVE THE LOCALLY SAVED TEMP FILE as the upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudanary };
