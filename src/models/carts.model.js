import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = "carts";

const stringNonUniqueRequired = {
  type: String,
  required: true,
};

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productid: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
          quantity: { type: Number, required: true, default: 1 },
          date: { type: Date, default: Date.now }, // para poder buscar por fecha
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // fecha de creación y update
  }
);

cartSchema.plugin(mongoosePaginate);
export const cartsModel = mongoose.model(cartsCollection, cartSchema);