// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para archivos JSON o db para usar MongoDB
// import ProductManager from "../services/filesystem/ProductManager.js";
import ProductManager from "../services/mongo/product.dao.js";
import CartManager from "../services/mongo/cart.dao.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

// Renderizo los productos en plantilla home
export const getViewsProducts = async (req, res) => {
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
};

export const viewProductById = async (req, res) => {
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
};

export const viewCartById = async (req, res) => {
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
};