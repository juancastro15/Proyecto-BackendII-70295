import { cartsModel } from "../models/carts.model";

export default class CartManager {
  constructor() {}

  // saveToFile() No se necesita en mongoDB

  getCartById(cid) {
    return cartsModel.findById(cid).populate("products.productid"); // ambos son métodos de mongoose =)
  }

  viewCartById(cid) {
    return cartsModel.findById(cid).populate("products.productid").lean();
  }

  addCart(products = { products: [] }) {
    return cartsModel.create(products);
  }

  updateCart(cid, updatedFields) {
    return cartsModel.findByIdAndUpdate(cid, updatedFields, { new: true }); // método de moongose: true devuelve el documento modificado y no el original
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid); // método de mongoose
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIndex = cart.products.findIndex(
        (p) => p.productid.toString() === pid
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productid: pid, quantity: 1 });
      }
      return cart.save(); // magia de mongoose que tira un updateOne
    } catch (error) {
      throw error;
    }
  }

  updateQuantity(cid, pid, updatedQuantity) {
    return cartsModel
      .findOneAndUpdate(
        { _id: cid, "products.productid": pid },
        { $set: { "products.$.quantity": updatedQuantity } },
        { new: true, runValidators: true }
      )
      .populate("products.productid");
  }

  async deleteProductFromCart(cid, pid) {
    try {
      // verifico que el carrito exista
      const cartExists = await cartsModel.findById(cid);
      if (!cartExists) {
        throw new Error("Cart not found");
      }
      // verifico que el producto exista en el carrito
      const productInCart = cartExists.products.findIndex(
        (product) => product.productid.toString() === pid
      );
      if (productInCart === -1) {
        throw new Error("Product doesn't exist in cart");
      }
      // si todo lo anterior está bien, hago el update
      const deletedPid = await cartsModel.updateOne(
        { _id: cid },
        { $pull: { products: { productid: pid } } }
      );
      if (deletedPid.modifiedCount === 0) {
        throw new Error("Can't eliminate the product from cart");
      }
      // retorno el carrito usando populate() y lean() para testear
      const updatedCart = await cartsModel
        .findById(cid)
        .populate("products.productid")
        .lean();
      if (!updatedCart) {
        throw new Error("Error retrieving updated cart");
      }
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllProducts(cid) {
    try {
      // verifico que el carrito exista
      const cartExists = await cartsModel.findById(cid);
      if (!cartExists) {
        throw new Error("Cart not found");
      }
      // tengo que vaciar el array de productos
      cartExists.products = [];
      const updatedCart = await cartExists.save(); // Moongoose tira un UptadeOne
      if (!updatedCart) {
        throw new Error("Error updating cart");
      }
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
}