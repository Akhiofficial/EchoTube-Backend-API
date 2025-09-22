// creating controllers
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
// import user.model for checking users exits or not in database
// import { User } from '../models/user.models.js';
import { User } from "../models/user.models.js";
//import upload on cloudinary
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import ApiResponse from "../utils/AppResponse.js";
import jwt from "jsonwebtoken";
import { response } from "express";
import deleteOldImage from "../utils/deleteOldImage.js";

// varibale for access token and refresh token
const generatesAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken(); // its method so add ()

    user.refreshToken = refreshToken; // set the refresh token in user model to add in DB for verification
    await user.save({ validateBeforeSave: false }); // save the user with refresh token // save in database
    return { accessToken, refreshToken }; // return the tokens
  } catch (error) {
    console.log("Token generation error:", error); // shows the error
    throw new ApiError(500, "Internal server error while generating tokens");
  }
};

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

  const { name, fullName, email, password, username, contactNumber } = req.body;
  // console.log("emial is ", email)

  // basic code to check field is empty or not
  // if (fullName === "") {
  //     throw new ApiError
  // }

  if (
    [fullName, email, password, username].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw ApiError(400, "All fields are required.");
  }

  // exited user check
  const exitedUsers = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUsers) {
    throw new ApiError(400, "Username or email  Already exits use another one");
  }

  // console.log(req.files)

  // created for phone number
  if (contactNumber) {
    // Only check if contactNumber is provided
    const exitedContactNumber = await User.findOne({
      contactNumber,
    });

    if (exitedContactNumber) {
      throw new ApiError(400, "Use another phone number it already exits");
    }
  }

  // its check the localfile path by using req.files
  // do console(req.files) for more info | we are using ? for optional cases
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // check for cover image also
  // const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log("avatarLocalPath", avatarLocalPath)

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar image required");
  }

  // now upload images on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check one more time avatr present or not otherwise DB candestroy
  if (!avatar) {
    throw new ApiError(400, "Avatr image required ");
  }

  // User.create creates the  filed in DB

  const user = await User.create({
    name,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // lets find user created or not
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // its mean password not seleted thats why we put -
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the users");
  }

  // return the response

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User regiterd Successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // login user get data from body
  // get user details from frontend like username or email and passowrd
  // check if user exists or not if exited give auth, else
  // validate password and mail
  // if valid then create access token and refresh token
  // return the response with user details and tokens
  // send respomse in cookies
  // check for login

  const { email, password, username } = req.body;

  // check for email or username and password for an empty string
  if (!email && !username && !password) {
    throw new ApiError(400, "email or username or password field is required.");
  }

  // check for user exits in database or not
  const user = await User.findOne({
    $or: [{ email, username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email or username");
  }

  // check for password match
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // generate access token and refresh token
  const { accessToken, refreshToken } =
    await generatesAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const cookieOptions = {
    httpOnly: true,
    secure: false, // set to true if using https
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined }, // set the refresh token to undefined
    },
    {
      new: true, // return the updated user
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true, // set to true if using https
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Refresh token is required or unauthorized request"
    );
  }

  try {
    // we are verifying user by matching the reprshed token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id); // its find the user by id

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generatesAccessTokenAndRefreshToken(user, _id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// change the current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // if (!(newPassword == confirmPassword)) {
  //   throw new ApiError(400, "New password and confirm password do not match");
  // }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  // user.confirmPassword = confirmPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// get current user profile ()
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, fullName, email } = req.body;

  if (!fullName || !name || !email) {
    throw new ApiError(400, "Name, fullName, and email are required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        name: name,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  //now finally upload on cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  const avatarUpdated = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, avatarUpdated, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // get local path of cover image
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(500, "Something went wrong while uploading cover image");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const Channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() }, // case insensitive match
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subcribers",
      },
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subcribersCount: { $size: "$subcribers" },
      },
      channelsubscribedToCount: { $size: "$subscribedTo" },
    },
    {
      isSubcribed: { $in: [req.user?._id, "$subcribers.subscriber"] },
    },
    {
      $cond: {
        if: { $in: [req.user?._id, "$subcribers.subscriber"] },
        then: true,
        else: false,
      },
    },{
      $project: {
        fullName: 1,
        name: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subcribersCount: 1,
        channelsubscribedToCount: 1,
        isSubcribed: 1,
      },
    }
  ]);

  if (!channel || channel.length === 0) {
    throw new ApiError(404, "Channel not found with this username");
  }
  
  return res 
  .status(200)
  .json(new ApiResponse(200, Channel[0], "Channel profile fetched successfully"));
});





// export {registerUser}
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
};
