import { productsModel } from "../models/products.model";

export default class ProductManager {
  constructor() {
    // console.log("Eureka! products from mongodb");
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
    return productsModel.findById(pid); // la magia de moongose!
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
    return productsModel.findByIdAndDelete(pid); // método de moongose, pura magia!
  }
}