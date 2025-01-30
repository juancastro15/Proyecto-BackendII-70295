// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para el guardado en archivos JSON o db para usar MongoDB
// import CartManager from "../services/filesystem/CartManager.js";
import CartManager from "../services/mongo/cart.dao.js";
import ProductManager from "../services/mongo/product.dao.js";
import TicketManager from "../services/mongo/ticket.dao.js";

const cartManager = new CartManager();
const productManager = new ProductManager();
const ticketManager = new TicketManager();

// devuelve todos los productos con populate
export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      // console.log(JSON.stringify(cart, null, "\t"));
      res.json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

// actualiza el carrito con un array de productos
export const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.updateCart(cartId, req.body);
    if (updatedCart) {
      // console.log(updatedCart);
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

// elimina todos los productos del carrito
export const deleteAllProducts = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.deleteAllProducts(cartId);
    res.json({
      status: "success",
      message: "All products deleted from selected cart",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error deleting all products from cart: ", error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

// crea un carrito con un array de productos
export const addCart = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products) {
      return res.status(400).json({ error: "Invalid cart" });
    }
    const cart = await cartManager.addCart({ products });
    res.status(201).json(cart);
  } catch (error) {
    console.log(error);
  }
};

// agrega un producto a cualquier carrito
export const addProductToCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    // console.log(`CID: ${cartId}, PID: ${productId}`);
    const updateCart = await cartManager.addProductToCart(cartId, productId);

    res.status(200).json({ message: "Product added to cart" });
    return updateCart;
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// elimina del carrito el producto seleccionado
export const deleteProductFromCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartManager.deleteProductFromCart(
      cartId,
      productId
    );
    res.json({
      status: "success",
      message: "Product deleted from cart",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error deleting a product from cart: ", error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

// actualizar solo la cantidad de ejemplares del producto
export const updateQuantity = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    // valido que quantity sea positivo para evitar quilombos en la empresa xD
    if (!quantity || quantity <= 0) {
      res.status(400).json({
        status: "error",
        message: "Your number is very wrong",
      });
    }

    const updatedCart = await cartManager.updateQuantity(
      cartId,
      productId,
      quantity
    );

    res.status(200).json({
      status: "success",
      newdata: updatedCart,
    });
  } catch (error) {
    console.error("Error trying to update the quantity of products:", error);
    res.status(500).json({
      status: "error",
      message: "Error trying to update the quantity of products",
      error: error.message,
    });
  }
};

// permite finalizar la compra del carrito
export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    // verifico que el carrito exista
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // valido el stock de cada producto en el carrito
    for (const item of cart.products) {
      const product = await productManager.getProductById(item.productid);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Not enough stock for product: ${product.title}`,
        });
      }
    }
    // si hay suficiente stock para todos los productos, actualizo el stock
    await Promise.all(
      cart.products.map((item) =>
        productManager.updateProduct(item.productid, {
          $inc: { stock: -item.quantity },
        })
      )
    );
    // avanzo con la compra y cambio el estado del carrito a "purchased"
    await cartManager.purchaseCart(cartId);
    await cartManager.updateCart(cartId, {
      status: "purchased",
    });
    const userId = req.user._id;
    // calculo el precio total de la compra
    const totalPrice = await cart.products.reduce(
      async (totalPromise, item) => {
        const total = await totalPromise;
        const product = await productManager.getProductById(item.productid);
        return total + item.quantity * product.price;
      },
      Promise.resolve(0)
    );
    // genero un nuevo ticket con los datos de la compra
    const newTicket = await ticketManager.addTicket({
      cartid: cartId,
      totalPrice: totalPrice,
      userid: userId,
    });
    res.json({
      status: "success",
      message: "Cart purchased successfully",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error trying to purchase the cart",
      error: error.message,
    });
  }
};