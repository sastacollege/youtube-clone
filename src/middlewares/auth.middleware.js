import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "./../models/users.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  //TWO WAYS TO GET USE ONE WAY 1.COOKIE 2.HEADER>AUTHORIZATION
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(404, "unauthorized request");
    }

    let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-pawword -accessToken",
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});
