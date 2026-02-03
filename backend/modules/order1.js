import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // "shoe"
    },
    status: {
      type: String,
      default: "Pending",
    },
    data: {
      name: String,
      quantity: Number,
      size: String,
      price: Number,
      deliveryFee: Number,
      totalFee: Number,
    },
  },
  { _id: false }
);

const orderSchema1 = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    date: {
      type: Date,
      required: true,
    },

    items: {
      type: [itemSchema],
      required: true,
    },

    grandTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order1 = mongoose.model("Order1", orderSchema1);
export default Order1;