import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersCollection = "users";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    idGithub: {
      type: String,
      default: "",
    },
    carts: {
      type: [
        {
          cartid: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
          date: { type: Date, default: Date.now }, // para poder filtrar por fecha si hace falta
        },
      ],
      default: [],
    },
    roles: {
      type: [String],
      default: ["user"],
    },
  },
  {
    timestamps: true, // fecha de creación y último update
  }
);

userSchema.plugin(mongoosePaginate);
export const usersModel = mongoose.model(usersCollection, userSchema);