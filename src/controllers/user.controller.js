import asyncHandler from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { uploadOnCloudanary } from "./../utils/cloudinary.service.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

let registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exists: username, email
  //check for images, check for avatar
  //upload them to cloudinary, avatar
  //create user object – create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return res

  //get user details from frontend
  const { username, email, password, fullname } = req.body;

  //validation - not empty
  //you can also do email validation also please do this yourself
  if ([username, email, password, fullname].some((el) => el?.trim() === "")) {
    throw ApiError(400, "All Fields Are Required");
  }

  //check if user already exists: username, email
  if (User.find({ $or: [{ username }, { email }] })) {
    throw ApiError(500, "USER ALREADY EXIST");
  }

  //check for images, check for avatar
  let avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw ApiError(400, "Avatar file is required");
  }

  //upload them to cloudinary, avatar
  const avatar = await uploadOnCloudanary(avatarLocalPath);
  const coverImage = await uploadOnCloudanary(coverImageLocalPath);
  if (!avatar) throw ApiError(400, "Avatar file is required");

  //create user object – create entry in db
  let user = await User.create({
    fullname,
    username: username.toLowercase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //Check whether user has created or not
  let isUserCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (isUserCreated) {
    throw ApiError(500, "Something went wrong while creating the user");
  }

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, isUserCreated, "User Registered Successfully"));
});

export default registerUser;
