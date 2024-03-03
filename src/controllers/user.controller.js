import { ApiError } from "./../utils/ApiError.js";
import { User } from "./../models/users.model.js";
import { uploadOnCloudanary } from "./../utils/cloudinary.service.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import asyncHandler from "./../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

//REGISTER USER
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

//LOGIN USER HELPER FUNCTION
const generateAccessAndRefreshToken = function (user) {
  let accessToken = user.generateAccessToken();
  let refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};

//LOGIN USER
let loginUser = asyncHandler(async (req, res) => {
  //get the data from the inputer
  let { username, email, password } = req.body;

  //check kro inputer nay email username or password diya
  if (!username || !email || !password) {
    throw new ApiError(400, "username or email or password is required");
  }

  if (!(username || email || password)) {
    throw new ApiError(400, "username or email or password is required");
  }

  //confirm user(inputer) hai aap kay database mail
  let user = await User.findOne({
    $or: [{ email }, { username }],
  });

  //Ager user database mai nhi hai to error do
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //Ager user exist krta hai to password check kro
  let isCorrectUserPassword = await user.isPasswordCorrect(password);

  if (!isCorrectUserPassword) {
    throw new ApiError(404, "Invalid user password");
  }

  //ager user ka password correct hai to user ko refreshToken and accessToken send kro in cookie
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  let optionCookie = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, optionCookie)
    .cookie("refreshToken", refreshToken, optionCookie)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully",
      ),
    );
});

//LOGOUT USER
let logoutUser = asyncHandler(async (req, res) => {
  //COOKIE CLEAR KRNA HAI && REFRESH TOKEN CLEAR

  //GET USERID FROM AUTH MIDDLEWARE
  let userId = req.user._id;

  //CLEAR refreshToken
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  //CLEAR COOKIE
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "USER LOGOUT"));
});

//TOKEN tokenRefreshing
//this will [refresh the access] token and give a [new access token] with the help of [refresh token]
let tokenRefreshing = asyncHandler(async (req, res) => {
  try {
    //GET THE REFRESH TOKEN FROM THE COOKIE
    let incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(404, "Unauthorised request");
    }

    //VERIFY THE INCOMING Refresh token with the
    let decode = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    //ENTER INTO THE DATABASE
    let user = await User.findById(decode?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateAccessAndRefreshToken(user);

    let option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("accessToken", newAccessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json({
        message: "NEW ACCESS TOKEN CREATED",
      });
  } catch (error) {
    res.send(err);
  }
});

export { registerUser, loginUser, logoutUser, tokenRefreshing };
