import mongoose from "mongoose";
import { Schema } from "mongoose";

let subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: " User",
    },

    channel: {
      type: Schema.Types.ObjectId,
      ref: " User",
    },
  },
  {
    timestamps: true,
  },
);

export let Subscription = mongoose.model("Subscription", subscriptionSchema);
