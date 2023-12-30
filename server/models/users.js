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
        element: String,
        unit: String,
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
