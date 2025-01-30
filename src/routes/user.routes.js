import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  onlyAdmins,
  githubCallback,
} from "../controllers/users.controller.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../utilities/passportCall.js";

const router = Router();

router.post("/register", passportCall("register"), registerUser);
router.post("/login", passportCall("login"), loginUser);
router.get("/logout", logoutUser);
router.get("/current", passportCall("jwt"), authorization("user"), currentUser);
router.get(
  "/onlyadmins",
  passportCall("jwt"),
  authorization("admin"),
  onlyAdmins
);
router.get("/github", passportCall("github"));
router.get("/githubcallback", passportCall("github"), githubCallback);

export default router;