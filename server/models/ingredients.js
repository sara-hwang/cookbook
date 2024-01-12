const mongoose = require("mongoose");

// all values are per 100 g serving
const NutrientSchema = new mongoose.Schema({
  name: String,
  id: Number,
  amount: Number,
  unit: String,
});

const IngredientPortion = new mongoose.Schema({
  gramWeight: Number,
  amount: Number,
  unit: String,
});

const IngredientSchema = new mongoose.Schema({
  fdcId: {
    type: Number,
    required: true,
    unique: true,
  },
  category: String,
  nutrition: [NutrientSchema],
  portions: [IngredientPortion],
});

const IngredientModel = mongoose.model("ingredients", IngredientSchema);
module.exports = IngredientModel;
