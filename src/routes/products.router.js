import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../utilities/passportCall.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", passportCall("jwt"), authorization("admin"), addProduct);
router.put("/:pid", passportCall("jwt"), authorization("admin"), updateProduct);
router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  deleteProduct
);

export default router;