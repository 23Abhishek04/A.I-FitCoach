import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    height: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },

    targetWeight: {
      type: Number,
      default: null,
    },

    fitnessGoal: {
      type: String,
      default: "General Fitness",
    },

    activity: {
      type: String,
      default: "Moderately Active",
    },

    fitnessLevel: {
      type: String,
      default: "Beginner",
    },

    dietType: {
      type: String,
      default: "Balanced",
    },

    dailyCalories: {
      type: Number,
      default: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  models.User || mongoose.model("User", UserSchema);

export default User;