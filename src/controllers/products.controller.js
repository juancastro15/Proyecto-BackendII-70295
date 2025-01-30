// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para el guardado en archivos JSON o db para usar MongoDB
// import ProductManager from "../services/filesystem/ProductManager.js";
import ProductManager from "../services/mongo/product.dao.js";
import { productsModel } from "../services/mongo/models/products.model.js";

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    // opciones
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let sort = req.query.sort === "desc" ? -1 : 1;
    // filtros
    let category = req.query.category;
    let stock = req.query.stock;

    //construyo el objeto opciones
    const options = {
      limit: limit,
      page: page,
      sort: { price: sort },
    };

    // construyo el objeto filtros y sus validaciones
    const filters = {};
    if (category) {
      filters.category = category;
    }

    if (stock === "true") {
      filters.stock = { $gt: 0 };
    } else if (stock === "false") {
      filters.stock = 0;
    }

    // ejecuto el paginate con filtros y opciones
    const products = await productsModel.paginate(filters, options);

    // armo el objeto para devolver
    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080/?page=${products.prevPage}`
        : "",
      nextLink: products.hasNextPage
        ? `http://localhost:8080/?page=${products.nextPage}`
        : "",
    };

    // devuelvo el response
    console.log("Respuesta del GET: ", response);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: "Invalid product, all fields are required" });
    }
    const product = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = await productManager.updateProduct(
      productId,
      req.body
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      res.json(deletedProduct);
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
};