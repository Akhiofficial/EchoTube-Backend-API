// creating controllers 
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
// import user.model for checking users exits or not in database 
// import { User } from '../models/user.models.js';
import { User } from '../models/user.models.js';
//import upload on cloudinary 
import { uploadOnCloudinary } from '../utils/cloudinary.service.js';
import ApiResponse from '../utils/AppResponse.js';


// route 
const registerUser = asyncHandler(async (req, res) => {

    //get user details from frontend 
    // validation fro email username etc 
    // check if user already exists via email or username 
    // check for images and avatar 
    // if images there then upload to cloudinary 
    // upload them user then multer 
    // create user objet - create entry in db 
    // remove pass and refresh token feild 
    // check for user creation 

    const { fullName, email, password, username, contactNumber } = req.body;
    // console.log("emial is ", email)

    // basic code to check field is empty or not 
    // if (fullName === "") {
    //     throw new ApiError
    // }

    if (
        [fullName, email, password, username].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw ApiError(400, "All fields are required.")
    }     

    const exitedUsers = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (exitedUsers) {
        throw new ApiError(400, "Username or email  Already exits use another one")
    }

    // console.log(req.files)

    // created for phone number
    if (contactNumber) {  // Only check if contactNumber is provided
        const exitedContactNumber = await User.findOne({
            contactNumber
        })

        if (exitedContactNumber) {
            throw new ApiError(400, "Use another phone number it already exits")
        }
    }

    // its check the localfile path by using req.files 
    // do console(req.files) for more info | we are using ? for optional cases 
    const avatarLocalPath = req.files?.avatar[0]?.path
    // check for cover image also 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage ) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path 
        
    }

    // console.log("avatarLocalPath", avatarLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image required")
    }




// now upload images on cloudinary 

const avatar = await uploadOnCloudinary(avatarLocalPath)

const coverImage = await uploadOnCloudinary
    (coverImageLocalPath)



// check one more time avatr present or not otherwise DB candestroy 
if (!avatar) {
    throw new ApiError(400, "Avatr image required ")
}


// User.create creates the  filed in DB 


const user =  await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

})

// lets find user created or not 
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // its mean password not seleted thats why we put - 
)

if(!createdUser) {
    throw new ApiError(500,"something went wrong while registering the users")
}


// return the response 

return res.status(201).json(
    new ApiResponse(200, createdUser, "User regiterd Successfully!")
)

})
// export {registerUser}
export default registerUser 