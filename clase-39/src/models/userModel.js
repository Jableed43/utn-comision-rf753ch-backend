import mongoose from "mongoose";
import { isGoodPassword } from "../utils/validators.js";

//Faltaria encriptacion y categoria de usuario

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  lastName: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 6,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
  },

  age: {
    type: Number,
    required: true,
    min: 16,
    max: 110,
  },

  registrationDate: {
    type: Date,
    default: Date.now(),
  },

  password: {
    required: true,
    type: String,
    validate: {
      validator: function (value) {
        return isGoodPassword(value);
      },
      message:
        "Password must be between 6 and 12 characters, with at least one number, one upercase letter and one lowercase letter",
    },
  },
});

export default mongoose.model("user", userSchema);
