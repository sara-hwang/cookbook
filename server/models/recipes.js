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
      isDivider: Boolean,
      amount: Number,
      element: String,
      unit: String,
      fdcId: String,
      fdcQuery: String,
    },
  ],
  steps: [
    {
      isDivider: Boolean,
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
  notes: String,
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
