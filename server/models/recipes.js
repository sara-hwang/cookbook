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
  photo: {
    type: String,
    default:
      "https://www.bunsenburnerbakery.com/wp-content/uploads/2020/02/banana-bread-muffins-26-square-735x735.jpg",
  },
  tags: [String],
  url: String,
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
