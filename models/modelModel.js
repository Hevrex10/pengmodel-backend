import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      min: [16, "Age must be at least 16"],
      max: [100, "Please provide a valid age"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    height: {
      type: String,
      required: [true, "Height is required"],
      trim: true,
    },

    chest: {
      type: String,
      required: [true, "Chest/Bust measurement is required"],
      trim: true,
    },

    waist: {
      type: String,
      required: [true, "Waist measurement is required"],
      trim: true,
    },
    eyeColor: {
      type: String,
      trim: true,
    },
    hips: {
      type: String,
      required: [true, "Hips measurement is required"],
      trim: true,
    },

    shoeSize: {
      type: String,
      required: [true, "Shoe size is required"],
      trim: true,
    },

    social: {
      type: String,
      trim: true,
      maxlength: [100, "Social handle is too long"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female"],
      lowercase: true,
    },

    photos: [
      {
        type: String,
        required: true,
      },
    ],
    videos: [
      {
        type: String,
        default: [],
      },
    ],
    status: {
      type: String,
      enum: ["approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  },
);

const Model = mongoose.model("Model", modelSchema);

export default Model;
