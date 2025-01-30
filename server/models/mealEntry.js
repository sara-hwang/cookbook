const mongoose = require("mongoose");

const MealEntrySchema = new mongoose.Schema({
  user: String,
  date: String,
  name: String,
  recipe: String,
  portions: Number,
});

const MealEntryModel = mongoose.model("log", MealEntrySchema);
module.exports = MealEntryModel;
