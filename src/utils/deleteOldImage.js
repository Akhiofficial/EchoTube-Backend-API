 
// src/utils/deleteOldImage.js 
// we are deleting old image from local path after uplaoding new image to cloudinary
import { v2 as cloudinary } from 'cloudinary';


const deleteOldImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting old image:", error);
  }
};

export default deleteOldImage;
