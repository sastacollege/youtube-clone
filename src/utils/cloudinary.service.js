import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "sastacollge",
  api_key: "675451948793347",
  api_secret: "lZ3NC5uY4YudulK0fRLxSZ3rUIs",
});

let uploadOnCloudanary = async (localFilePath) => {
  try {
    if (!localFilePath) return next();

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    //REMOVE THE LOCALLY SAVED TEMP FILE as the upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudanary };
