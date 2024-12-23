import { Router } from "express";
import UserManager from "../service/users.services.js";
import { usersModel } from "../models/users.model.js";
import { createHash } from "../utilities/hashing.utils.js";
import passport from "passport";
import { generateToken } from "../utilities/genToken.utils.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../utilities/passportCall.js";

const userManager = new UserManager();
const router = Router();

// para registrar un usuario nuevo
router.post("/register", passportCall("register"), async (req, res) => {
  try {
    if (!req.user) return res.status(400).json("Registration failed");
    const token = generateToken(req.user);
    res
      .cookie("pistachosSanjuaninos", token, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: false,
      })
      .status(201)
      .json({ message: "User registered & logged in" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// para hacer login
router.post("/login", passportCall("login"), async (req, res) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Login failed" });
    const token = generateToken(req.user);
    res
      .cookie("pistachosSanjuaninos", token, { httpOnly: true })
      .status(201)
      .json({ message: "User logged in" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// para desloguearse
router.get("/logout", (req, res) => {
  res.clearCookie("pistachosSanjuaninos").json({ message: "User logged out" });
});

// para levantar los datos y darle autorización a un "user" que está logueado
router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  (req, res) => {
    const payload = {
      firstName: req.user.firstName,
      email: req.user.email,
      roles: req.user.roles,
    };
    res.status(200).json(payload);
  }
);

// para levantar los datos y dar autorización a un "admin" que está logueado
router.get(
  "/onlyadmins",
  passportCall("jwt"),
  authorization("admin"),
  (req, res) => {
    const payload = {
      firstName: req.user.firstName,
      email: req.user.email,
      roles: req.user.roles,
    };
    res.status(200).json(payload);
  }
);

// para loguear usando la cuenta de Github
router.get("/github", passportCall("github"));
router.get("/githubcallback", passportCall("github"), (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Invalid credentials for Github" });
    const token = generateToken(req.user);
    res
      .cookie("pistachosSanjuaninos", token, { httpOnly: true })
      .send("User logged in with Github");
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;