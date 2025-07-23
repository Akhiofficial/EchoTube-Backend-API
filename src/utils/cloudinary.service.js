import { v2 as cloudinary } from 'cloudinary'; // use from cloudinary service 
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded succefully 
        console.log("File uploaded on cloudinary", response.url) // it print response url 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // it remove the locally save temporaary file as the upload operation got failed
        return null

    }
}

export { uploadOnCloudinary } // upload files using localFilePath 