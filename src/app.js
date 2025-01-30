import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import initializatePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import MongoSingleton from "./config/mongoSingleton.js";
import { customResponses } from "./utilities/customResponses.js";

// para cambiar de persistencia, comentar/descomentar uno de estos 2 imports: filesystem para archivos JSON o db para usar MongoDB
// import ProductManager from "./services/filesystem/ProductManager.js";
import ProductManager from "./services/mongo/product.dao.js";

// config express
const app = express();
const PORT = process.env.PORT || 8080; // la variable env.PORT solo la uso para levantar el server en glitch.com
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

// auth con passport
app.use(cookieParser());
app.use(passport.initialize());
initializatePassport();

// manejo de errores y respuestas
app.use(customResponses);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

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
app.use("/api/tickets", ticketsRouter);
app.use("/", viewsRouter);

// telemetría
app.use("/ping", (req, res) => {
  res.send("pong");
});

// conexión a la DB
MongoSingleton.getInstance();

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