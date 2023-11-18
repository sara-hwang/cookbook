const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      amount: Number,
      element: {
        type: String,
        lowercase: true,
      },
      unit: String,
    },
  ],
  steps: [
    {
      stepNumber: Number,
      text: String,
    },
  ],
  servings: {
    type: Number,
    default: 1,
  },
  photo: String,
  thumbnail: String,
  tags: [String],
  url: String,
  dateAdded: Number,
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
