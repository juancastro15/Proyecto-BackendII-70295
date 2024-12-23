import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './src/routes/user.routes'
import mongoose from 'mongoose'
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import passport from "passport";
import initializatePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";

// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para archivos JSON o db para usar MongoDB

// import ProductManager from "./services/filesystem/ProductManager.js";
import ProductManager from "./services/db/product.services.js";

// config express
const app = express();
const PORT = process.env.PORT || 8080; // la variable env.PORT solo la uso para levantar el server en glitch.com
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initializatePassport();

// config Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// HTML estático
app.use(express.static(__dirname + "/public/"));

// middlewares de rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

// telemetría
app.use("/ping", (req, res) => {
  res.send("pong");
});

// conexión a la DB
const PathDB = process.env.DB_ACCESS;
const connectMongoDB = async () => {
  try {
    await mongoose.connect(PathDB);
    console.log("Conectado a la DB usando Moongose!");
  } catch (error) {
    console.log("No me puedo conectar a la DB usando Moongose: " + error);
    process.exit();
  }
};
connectMongoDB();

const httpServer = app.listen(PORT, () => {
  console.log(`Server escuchando en el puerto ${PORT}`);
});

// nueva instancia de socket.io del lado del server
const socketServer = new Server(httpServer);

// llamo a la clase para poder levantar la lista de productos
const productManager = new ProductManager();

socketServer.on("connection", async (socket) => {
  console.log("Cliente socket conectado!");

  // levanto y mando la lista actual de productos al cliente
  const products = await productManager.getAllProducts();
  // console.log(products);
  socket.emit("updateProducts", products);

  socket.on("productChanged", async () => {
    socket.emit("updateProducts", await productManager.getAllProducts());
  });
});