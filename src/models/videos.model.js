import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "npm i mongoose-aggregate-paginate-v2";

let videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);

export let Video = mongoose.model("Video", videoSchema);
