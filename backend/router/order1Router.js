import express from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateItemStatus } from "../controller/order1Controller.js";


const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:orderId/item/:index", updateItemStatus);
router.delete("/:id", deleteOrder);

export default router;
