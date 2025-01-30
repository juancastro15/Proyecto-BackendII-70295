import { productsModel } from "./models/products.model.js";

export default class ProductManager {
  constructor() {
    // console.log("products from mongodb");
  }

  // saveToFile() No se necesita en mongoDB

  getAllProducts(limit) {
    if (limit) {
      return productsModel.find().limit(limit);
    }
    return productsModel.find();
  }

  paginatedProducts(limit, page) {
    return productsModel.paginate({}, { limit: limit, page: page, lean: true });
  }

  getProductById(pid) {
    return productsModel.findById(pid); 
  }

  viewProductById(pid) {
    return productsModel.findById(pid).lean();
  }

  addProduct(product) {
    return productsModel.create({
      ...product,
      status: true,
    });
  }

  updateProduct(pid, updatedFields) {
    return productsModel.findByIdAndUpdate(pid, updatedFields, { new: true }); // método de moongose: true devuelve el documento modificado y no el original
  }

  deleteProduct(pid) {
    return productsModel.findByIdAndDelete(pid); // método de moongose
  }
}