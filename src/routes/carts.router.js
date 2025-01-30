import { Router } from "express";
import {
  getCartById,
  updateCart,
  deleteAllProducts,
  addCart,
  addProductToCart,
  deleteProductFromCart,
  updateQuantity,
  purchaseCart,
} from "../controllers/carts.controller.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../utilities/passportCall.js";

const router = Router();

router.get("/:cid", getCartById);
router.put("/:cid", passportCall("jwt"), authorization("user"), updateCart);
router.delete(
  "/:cid",
  passportCall("jwt"),
  authorization("user"),
  deleteAllProducts
);
router.post("/", passportCall("jwt"), authorization("user"), addCart);
router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("user"),
  addProductToCart
);
router.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("user"),
  deleteProductFromCart
);
router.put("/:cid/produc/:pid", updateQuantity);

router.get(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("user"),
  purchaseCart
);

export default router;