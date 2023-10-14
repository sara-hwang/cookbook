const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
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
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
