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
  steps: [String],
  servings: {
    type: Number,
    default: 1,
  },
  photo: String,
  tags: [String],
  url: String,
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
