const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const UserController = require("../controllers/userController");

router.get("/login", UserController.loginPage);

router.post("/login", UserController.login);

router.get("/register", UserController.registerPage);

router.post("/register", upload.none(), UserController.register);

router.get("/logout", UserController.logout);

module.exports = router;
