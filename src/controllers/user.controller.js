import { ApiError } from "./../utils/ApiError.js";
import { User } from "./../models/users.model.js";
import { uploadOnCloudanary } from "./../utils/cloudinary.service.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

let registerUser = async (req, res) => {
  //JSON
  let { username, email, fullname, password } = req.body;

  //CHECK EMPTY FIELDS
  if (
    [username, email, fullname, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  //USER ALREADY EXIST
  let userExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExist) {
    throw new ApiError(409, "User with email or username already exist");
  }

  //MULTER
  let avatarLocalPath = req.files?.avatar[0]?.path;
  // let coverImageLocalPath = req.files?.coverImage[0]?.path;
  //doing this just because to avoid error
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //avatar file is required
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  //Upload avatar and coverImage to cloudinary and remeber you upload the cloudinary image path to database
  let avatar = await uploadOnCloudanary(avatarLocalPath);
  let coverImage = await uploadOnCloudanary(coverImageLocalPath);

  //check avatar file is exist on cloudnary or not bczo if that is not present app will crash
  if (!avatar) throw new ApiError(400, "avatar file is required");

  //UPLOAD TO DATABASE
  let user = await User.create({
    username,
    email,
    fullname,
    password,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });

  //Check userCreated
  const userCreated = await User.find(user._id).select(
    "-password -refreshToken",
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, userCreated, "USER CREATED SUCCESSFULLY 🎉🎉🎉"),
    );
};

export { registerUser };
