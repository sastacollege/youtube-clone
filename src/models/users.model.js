import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //use index which you want to query based upon the email field
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      uniquer: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Please set the password"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

//DON NOTY USE ARROW FUNCTION BCZO THE DO NOT HAVE CONTEXT
//USE ASYNC FUNCTION BCOZ IT TAKES SOME TIM TO DO ITS WORK
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

//CUSTOM METHODS
userSchema.methods.isPasswordCorrect = async function (passsword) {
  return await bcryptjs.compare(passsword, this.passsword);
};

//CREATE ACCESSTOKEN
userSchema.methods.generateAccessToken = function () {
  let token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRRY,
    },
  );

  return toekn;
};

//CREATE REFRESH TOKEN
//SAME LIKE ACCESS TOKEN BUT DIFFERENT USECASE
userSchema.methods.generateAccessToken = function () {
  let token = jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
  return token;
};

export let User = mongoose.model("User", userSchema);
