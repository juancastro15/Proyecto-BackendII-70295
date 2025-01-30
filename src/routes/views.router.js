import { Router } from "express";
import {
  getViewsProducts,
  viewProductById,
  viewCartById,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", getViewsProducts);
router.get("/products/:pid", viewProductById);
router.get("/carts/:cid", viewCartById);

// Renderizo los productos usando socket en la plantilla realtimeproducts
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

export default router;