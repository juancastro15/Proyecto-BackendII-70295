import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketsCollection = "tickets";

const ticketSchema = mongoose.Schema(
  {
    cartid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true, // fecha de creación y update
  }
);

ticketSchema.plugin(mongoosePaginate);
export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema);