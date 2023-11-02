const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const JWT_SECRET = require("../config/auth");

const SALT_ROUNDS = 10;
console.log("JWT_SECRET:", JWT_SECRET);


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Login failed! Check authentication credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send({ success: false, message: "Invalid credentials." });
      return;
    }

    // Save user data in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    res.status(200).send({ success: true, message: "Logged in successfully." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
};

exports.loginPage = async (req, res) => {
  const isLogin = req.session.isAuthenticated;
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "login.ejs")
  );
  res.render("partials/layout", { body: content, isLogin });
};

exports.register = async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    req.body.password = hashedPassword;

    const user = new User(req.body);

    await user.save();

    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    req.session.isAuthenticated = true;
    res.redirect('/events'); 

  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message);
    }

    console.error("Registration error:", err);
    res.status(500).send("An error occurred during registration.");
  }
};

exports.registerPage = async (req, res) => {
  const isLogin = req.session.isAuthenticated;
  const years = [
    { value: 2023, label: "2023" },
    { value: 2022, label: "2022" },
  ];

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "register.ejs"),
    { years }
  );

  res.render("partials/layout", { body: content, isLogin });
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

exports.logout = (req, res) => {
  // Destroy the session and redirect to homepage or login page
  req.session.destroy((err) => {
      if (err) {
          console.error("Error during logout:", err);
          res.status(500).send({ success: false, message: "Internal server error during logout." });
          return;
      }
      res.redirect('/');  // redirect to homepage or login page after logout
  });
};


exports.getProfile = async (req, res) => {
  res.send(req.user);
};
