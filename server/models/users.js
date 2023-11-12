const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  grocery: {
    type: [
      {
        amount: Number,
        element: {
          type: String,
          lowercase: true,
        },
        unit: String,
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
