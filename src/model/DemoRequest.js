import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", demoRequestSchema);

export default DemoRequest;
