const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/userSchema");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.json({ success: true, message: "api success." });
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong!" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;
    const user = new User({ username });
    await user.save();
    res.status(201).json({
      success: true,
      message: "user created successfully.",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "something went wrong." });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    console.log(
      "SO YOU WANT TO DELETE A FUCKING USER WITH THE FUCKING ID OF " +
        req.params.id
    );
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).end();
    res.status(204).end();
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ success: true, message: "found user.", data: user });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ success: false, message: "problem while finding user by id." });
  }
});

module.exports = app;
