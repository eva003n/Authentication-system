import mongoose, { Schema } from "mongoose";
import options from "./index.js";
import bcrypt from "bcryptjs";
import { boolean } from "zod";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true, //unique single field index
      minlength: [5, "Email lenth must be at least 5 charaters long"],
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      trim: true,
      select: false, //hide password from queries
    },

    //manage roles
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isSessionProtected: {
      type: boolean,
      default: false
    },

    refreshToken: {
      type: String,
      select: false, //hide token from query unless explictly included
    },
  },
  options,
);

//custom hooks
//before saving a creating  new user hash password
userSchema.pre("save", async function () {
  //checks if the provided path is modified then returns true  else if no argument is passed returns true for all paths
  //check if password is modified to avoid hasing the same password each time
  if (!this.isModified("password") || !this.password) {
    //passowrd not modified or it doesnt exist call next middleware
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  
});

//custom methods
//instance methods only work with a model instanve
userSchema.methods.isMatchingPassword = async function (password) {
  return bcrypt.compare(password, this.password); //userpassword, hashedpassword
};
//set users refresh token
userSchema.methods.setRefreshToken = async function (token) {
  this.refreshToken = token;
};

//statics
userSchema.statics.findUser = async function (userId) {
  //this refers to User model
  return this.findById(userId);
};
// userSchema.statics.findUserAndAddStreaks = async function (
//   userId,
//   streaksCount
// ) {
//   //this refers to User model
//   this.findById(userId).streaks = streaksCount;
// };

const User = mongoose.model("User", userSchema);

/* User.on("index", (error) => {
  if (error) console.error(`Error building indexes at user model`);
console.log("Successful index building at user model");
}); */

export default User;
