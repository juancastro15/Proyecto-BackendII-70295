import mongoose from "mongoose";

export default class MongoSingleton {
  static #instance;

  constructor() {
    const PathDB = process.env.DB_ACCESS;
    mongoose.connect(PathDB);

    mongoose.connection.on("error", (err) => {
      console.log(`MongoDB connection error: ${err}`);
      process.exit(1); // Exit the process with failure
    });

    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB using Mongoose!");
    });
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected to MongoDB");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    return this.#instance;
  }
}