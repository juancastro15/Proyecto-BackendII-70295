import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const stringUniqueRequired = {
  type: String,
  unique: true,
  required: true,
};

const stringNonUniqueRequired = {
  type: String,
  required: true,
};

const numberNonUniqueRequired = {
  type: Number,
  required: true,
};

const productSchema = new mongoose.Schema(
  {
    title: stringNonUniqueRequired,
    description: stringNonUniqueRequired,
    code: stringUniqueRequired,
    price: numberNonUniqueRequired,
    stock: numberNonUniqueRequired,
    category: stringNonUniqueRequired,
    thumbnails: [stringNonUniqueRequired],
    status: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection, productSchema);