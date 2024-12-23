import { Router } from "express";

// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para archivos JSON o db para usar MongoDB

// import ProductManager from "../services/filesystem/ProductManager.js";
import ProductManager from "../service/product.services.js";
import CartManager from "../service/cart.services.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Renderizo los productos en plantilla home
router.get("/", async (req, res) => {
  try {
    // opciones
    let limit = parseInt(req.query.limit) || 5;
    let page = parseInt(req.query.page) || 1;

    const products = await productManager.paginatedProducts(limit, page);

    // navegación de páginas
    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/?page=${products.prevPage}`
      : "";
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/?page=${products.nextPage}`
      : "";

    // validación de extremos para handlebars
    products.isValid = !(page <= 0 || page > products.totalPages);

    // console.log("Productos desde Mongo: ", products);
    res.render("home", products);
  } catch (error) {
    console.log("Error al obtener productos", error);
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.viewProductById(productId);
    console.log(product);
    if (product) {
      res.render("product", product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log("Error al obtener el producto", error);
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.viewCartById(cartId);
    console.log(cart);
    if (cart) {
      res.render("carts", { cart });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log("Error al obtener el producto", error);
  }
});

// Render anterior de productos que usaba con filesystem
// router.get("/", async (req, res) => {
//   try {
//     const products = await productManager.getAllProducts();
//     res.render("home", {
//       style: "home.css",
//       products,
//     });
//   } catch (error) {
//     console.log("Error al obtener productos", error);
//   }
// });

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