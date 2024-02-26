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
      fdcId: Number,
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
  nutritionalValues: {
    _1008: Number,
    _1003: Number,
    _1004: Number,
    _1005: Number,
    _1079: Number,
    _2000: Number,
    _1087: Number,
    _1089: Number,
    _1093: Number,
    _1258: Number,
    _1253: Number,
    _1257: Number,
  },
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports = RecipeModel;
