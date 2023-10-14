const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RecipeModel = require("./models/recipes");

require("dotenv").config({ path: "../.env" });
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cookbook.efjxjit.mongodb.net/cookbook`
);

app.get("/get", async (req, res) => {
  try {
    let response = await RecipeModel.find();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

app.post("/add", (req, res) => {
  const obj = req.body;
  console.log(obj);
  try {
    let response = RecipeModel.create(obj);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
