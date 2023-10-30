const User = require("../models/user");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
//load env
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("username:", username);

    const user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Login failed! Check authentication credentials" });
    }

    // Compare the provided password with the stored hash in the database.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Passwords do not match
      res.status(401).send({ success: false, message: "Invalid credentials." });
      return;
    }

    // Password is correct. Generate a JWT for the user.
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .send({ success: true, message: "Logged in successfully.", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
};

exports.loginPage = async (req, res) => {
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "login.ejs")
  );
  res.render("partials/layout", { body: content });
};

exports.register = async (req, res) => {
  try {
    console.log("request body: ", req.body)
    const user = new User(req.body);
    console.log(user);
    await user.save();
    // TODO: login user after registration
    res.redirect("/events");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.registerPage = async (req, res) => {
  const years = [
    { value: 2023, label: "2023" },
    { value: 2022, label: "2022" },
  ];

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "register.ejs"),
    { years }
  );

  res.render("partials/layout", { body: content });
};  

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      password,
      role,
      firstName,
      middleName,
      lastName,
      graduationYear,
      major,
      email,
      bio,
      profilePicture,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        username,
        password,
        role,
        firstName,
        middleName,
        lastName,
        graduationYear,
        major,
        email,
        bio,
        profilePicture,
      },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("Logout successful");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send("Logout successful");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.send(req.user);
};
