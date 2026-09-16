require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RecipeModel = require("./models/recipes");
const MealEntryModel = require("./models/mealEntry");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/users");
const IngredientModel = require("./models/ingredients");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const axios = require("axios");

require("log-timestamp");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cookbook.efjxjit.mongodb.net/cookbook`
);

app.post("/authenticate", async (req, res) => {
  let { username, password } = req.body;
  let existingUser;

  try {
    existingUser = await UserModel.findOne({ username: username });
  } catch {
    res.status(500).json({ message: "Error authenticating user" });
  }
  if (!existingUser || existingUser.password != password) {
    res.status(500).json({ message: "Incorrect credentials" });
  } else {
    let token;
    try {
      token = jwt.sign(
        { username: existingUser.username },
        "secretkeyappearshere",
        { expiresIn: "1h" }
      );
      res.json({
        token: token,
        expiresIn: 60 * 60,
        authUserState: { username: existingUser.username },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
});

app.get("/user/:id/grocery", async (req, res) => {
  try {
    let response = await UserModel.findOne({ username: req.params.id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: `Error getting grocery list for user ${req.params.id}`,
    });
  }
});

app.put("/user/:id/grocery", async (req, res) => {
  const obj = req.body;
  try {
    let response = await UserModel.updateOne(
      { username: req.params.id },
      {
        grocery: [...obj],
      }
    );
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.get("/user/:id/favourites", async (req, res) => {
  try {
    let response = await UserModel.findOne({ username: req.params.id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: `Error getting favourites for user ${req.params.id}`,
    });
  }
});

app.put("/user/:id/favourites", async (req, res) => {
  const obj = req.body;
  try {
    let response = await UserModel.updateOne(
      { username: req.params.id },
      {
        favourites: [...obj],
      }
    );
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.get("/recipes/getAll", async (req, res) => {
  console.log("Getting all recipes");
  try {
    let response = await RecipeModel.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/recipes/get", async (req, res) => {
  try {
    let response = await RecipeModel.findOne(req.query);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json(error);
  }
});

app.post("/recipes/add", async (req, res) => {
  const obj = req.body;
  try {
    let response = await RecipeModel.create(obj);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400);
      res.json("A recipe with that title already exists.");
    } else {
      res.status(500);
      res.json(error.message);
    }
  }
});

app.post("/log/add", async (req, res) => {
  const obj = req.body;
  try {
    let response = await MealEntryModel.create(obj);
    res.status(200);
    res.json(response);
    console.log("added meal log");
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.put("/log/:id", async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  try {
    let response = await MealEntryModel.findByIdAndUpdate(id, obj, {
      new: true,
    });
    res.status(200);
    res.json(response);
    console.log("updated meal log");
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.delete("/log/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let response = await MealEntryModel.findByIdAndDelete(id);
    res.status(200);
    res.json(response);
    console.log("deleted meal log");
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.get("/users/:userId/logs", async (req, res) => {
  console.log(`Getting meal logs for user: ${req.params.userId}`);
  try {
    let response = await MealEntryModel.find({ user: req.params.userId });
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json(error);
  }
});

app.post("/image/upload", upload.single("image"), async (req, res) => {
  const AUTH = "Client-ID " + process.env.IMGUR_CLIENT_ID;
  const data = {
    image: req.file.buffer.toString("base64"),
    type: "base64",
  };

  try {
    const response = await axios.post("https://api.imgur.com/3/image/", data, {
      headers: { Authorization: AUTH },
    });
    res.status(200);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.put("/recipes/:id", async (req, res) => {
  const obj = req.body;
  try {
    const sanitizedIngredients = (obj.ingredients ?? []).map((ingredient) => {
      if (!ingredient || ingredient.isDivider) return ingredient;
      const hasFdcLink =
        ingredient.fdcId !== undefined &&
        ingredient.fdcId !== null &&
        ingredient.fdcId !== "" &&
        Number.isFinite(Number(ingredient.fdcId));

      if (!hasFdcLink) {
        return {
          ...ingredient,
          fdcId: null,
          fdcQuery: "",
          fdcUnit: null,
          fdcAmount: null,
        };
      }

      return ingredient;
    });

    const payload = {
      ...obj,
      ingredients: sanitizedIngredients,
    };

    RecipeModel.validate(payload);
    let response = await RecipeModel.updateOne({ key: obj.key }, payload);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.post("/recipes/:id/duplicate", async (req, res) => {
  console.log(`Duplicating recipe ${req.params.id}`);
  try {
    // Get the original recipe
    let originalRecipe = await RecipeModel.findOne({ key: req.params.id });
    if (!originalRecipe) {
      res.status(404);
      res.json({ message: "Recipe not found" });
      return;
    }

    // Create a copy of the recipe with a new key and title
    let newRecipe = originalRecipe.toObject();
    delete newRecipe._id; // Remove MongoDB ID to generate a new one

    // Preserve important fields
    const thumbnail = newRecipe.thumbnail;
    const photo = newRecipe.photo;

    // Generate a new key by appending "-copy"
    let newKey = `${newRecipe.key}-copy`;
    let keyExists = true;
    let attempts = 0;

    // Keep appending "-copy" until we find a unique key
    while (keyExists && attempts < 100) {
      const existing = await RecipeModel.findOne({ key: newKey });
      if (!existing) {
        keyExists = false;
      } else {
        newKey = `${newKey}-copy`;
        attempts++;
      }
    }

    newRecipe.key = newKey;
    newRecipe.thumbnail = thumbnail;
    newRecipe.photo = photo;

    // Update title to indicate it's a copy
    newRecipe.title = `${newRecipe.title} (Copy)`;

    // Reset dateAdded to current time
    newRecipe.dateAdded = Date.now();

    // Create the duplicate recipe
    let response = await RecipeModel.create(newRecipe);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.delete("/recipes/:id", async (req, res) => {
  console.log(`Deleting ${req.params.id}`);
  try {
    let response = await RecipeModel.deleteOne({ key: req.params.id });
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.get("/ingredients/search", async (req, res) => {
  const query = req.query.query;
  if (!query || !query.toString().trim()) {
    res.status(200).json([]);
    return;
  }

  try {
    const regex = new RegExp(
      query
        .toString()
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const response = await IngredientModel.find({
      $or: [{ name: regex }, { category: regex }],
    }).limit(20);

    const results = response.map((ingredient) => ({
      fdcId: ingredient.fdcId,
      query:
        ingredient.name ||
        ingredient.category ||
        `Custom ingredient ${ingredient.fdcId}`,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

app.get("/ingredients/:id", async (req, res) => {
  console.log(`Getting ingredient ${req.params.id}`);
  try {
    let response = await IngredientModel.findOne({ fdcId: req.params.id });
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json(error);
  }
});

app.post("/ingredients/add", async (req, res) => {
  const obj = req.body;
  let candidate = { ...obj };

  if (candidate.name && !candidate.fdcId) {
    candidate.fdcId = -Math.abs(Date.now() + Math.floor(Math.random() * 1000));
  }

  // If fdcId exists and is negative (custom ingredient), try to update it
  if (candidate.fdcId && candidate.fdcId < 0) {
    try {
      const response = await IngredientModel.findOneAndUpdate(
        { fdcId: candidate.fdcId },
        {
          ...candidate,
          category: candidate.category ?? "Custom",
        },
        { new: true }
      );
      if (response) {
        res.status(200);
        res.json(response);
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json(error.message);
      return;
    }
  }

  // For new ingredients, check for duplicates by name
  if (candidate.name) {
    const escapedName = candidate.name
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingIngredient = await IngredientModel.findOne({
      name: new RegExp(`^${escapedName}$`, "i"),
    });

    if (existingIngredient) {
      res
        .status(400)
        .json({ message: "An ingredient with that name already exists." });
      return;
    }
  }

  try {
    let response = await IngredientModel.create({
      ...candidate,
      category: candidate.category ?? "Custom",
    });
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400);
      res.json("An ingredient with that FDC ID already exists.");
    } else {
      res.status(500);
      res.json(error.message);
    }
  }
});

app.get("/healthcheck", async (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/chat", async (req, res) => {
  const message = req.query.body;
  console.log(message);
  try {
    const response = await openai.chat.completions.create({
      messages: message.map((msg) => {
        return { role: "user", content: msg };
      }),
      model: "gpt-3.5-turbo",
    });
    console.log(response.choices[0].message.content);
    res.status(200);
    res.json(response.choices[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
  }
});

app.listen(3000, () => {
  console.log("server is running");
});
