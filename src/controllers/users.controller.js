import FullNameDTO from "../services/dto/fullname.dto.js";
import UserManager from "../services/mongo/users.dao.js";
import { generateToken } from "../utilities/genToken.utils.js";

const userManager = new UserManager();

// para registrar un usuario nuevo
export const registerUser = async (req, res) => {
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
};

// para hacer login
export const loginUser = async (req, res) => {
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
};

// para desloguearse
export const logoutUser = async (req, res) => {
  res.clearCookie("pistachosSanjuaninos").json({ message: "User logged out" });
};

// para levantar los datos y darle autorización a un "user" que está logueado
export const currentUser = async (req, res) => {
  const payload = new FullNameDTO(req.user);
  res.status(200).json(payload);
};

// para levantar los datos y dar autorización a un "admin" que está logueado
export const onlyAdmins = async (req, res) => {
  const payload = {
    firstName: req.user.firstName,
    email: req.user.email,
    roles: req.user.roles,
  };
  res.status(200).json(payload);
};

// para loguear usando la cuenta de Github
export const githubCallback = async (req, res) => {
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
};