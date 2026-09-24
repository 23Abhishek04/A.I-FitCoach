import mongoose, { Schema, models } from "mongoose";

const ProgressEntrySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    water: {
      type: Number,
      default: 0,
    },
    workout: {
      type: String,
      enum: ["Completed", "Rest Day", "Skipped"],
      default: "Completed",
    },
    calories: {
      type: Number,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ProgressEntrySchema.index(
  { email: 1, date: 1 },
  { unique: true }
);

const ProgressEntry =
  models.ProgressEntry ||
  mongoose.model("ProgressEntry", ProgressEntrySchema);

export default ProgressEntry;
