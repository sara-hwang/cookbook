const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RecipeModel = require("./models/recipes");
const { error } = require("console");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://sara:sara123abc@cookbook.efjxjit.mongodb.net/cookbook"
);

app.get("/get", (req, res) => {
  RecipeModel.find()
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

app.post("/add", (req, res) => {
  const obj = req.body;
  console.log(obj);
  RecipeModel.create(obj)
    .then((result) => res.json(result))
    .catch((error) => console.log(error));
});

app.listen(3001, () => {
  console.log("server is running");
});
