const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");

router.get("/login", UserController.loginPage);

router.post("/login", UserController.login);

router.get("/register", UserController.registerPage);

router.post("/register", UserController.register);

module.exports = router;
