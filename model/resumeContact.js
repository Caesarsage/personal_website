import mongoose from 'mongoose'

const { Schema } = mongoose;

const resumeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide your name']
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ResumeContact = mongoose.model("ResumeContact", resumeSchema);