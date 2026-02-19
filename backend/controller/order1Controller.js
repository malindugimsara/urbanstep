import Order1 from "../modules/order1.js";


/**
 * CREATE NEW ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { customer, date, items } = req.body;

    // BASIC VALIDATION
    if (
      !customer ||
      !customer.name ||
      !customer.phoneNumber ||
      !customer.address
    ) {
      return res.status(400).json({
        message: "Customer details are required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one order item is required",
      });
    }

    // CALCULATE GRAND TOTAL (BACKEND TRUST)
    let totalPrice = 0;
let totalDeliveryFee = 0;
let grandTotal = 0;

const normalizedItems = items.map((item) => {
  const price = Number(item?.data?.price) || 0;
  const deliveryFee = Number(item?.data?.deliveryFee) || 0;
  const quantity = Number(item?.data?.quantity) || 0;

  const totalFee = (price * quantity) + deliveryFee;

  totalPrice += price * quantity;
  totalDeliveryFee += deliveryFee;
  grandTotal += totalFee;

  return {
    type: item.type,
    status: item.status || "Pending",
    data: {
      name: item.data.name || "",
      quantity,
      size: item.data.size || "",
      price,
      deliveryFee,
      totalFee,
    },
  };
});


    // AUTO GENERATE ORDER ID
   // FIND LAST ORDER
const lastOrder = await Order1.findOne().sort({ createdAt: -1 });

let nextNumber = 1;

if (lastOrder && lastOrder.orderId) {
  const lastNumber = parseInt(lastOrder.orderId.split("-")[1]);
  nextNumber = lastNumber + 1;
}

const orderId = `ORD-${nextNumber.toString().padStart(3, "0")}`;


    // CREATE ORDER
   const order = new Order1({
  orderId,
  customer,
  date: date ? new Date(date) : new Date(),
  items: normalizedItems,
  price: totalPrice,
  deliveryFee: totalDeliveryFee,
  grandTotal,
});


    await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * GET ALL ORDERS
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order1.find().sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * GET SINGLE ORDER
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order1.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * UPDATE ITEM STATUS
 */
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, index } = req.params;
    const { status } = req.body;

    const order = await Order1.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.items[index]) {
      return res.status(400).json({ message: "Invalid item index" });
    }

    order.items[index].status = status;
    await order.save();

    res.status(200).json({
      message: "Item status updated",
      order,
    });
  } catch (error) {
    console.error("Update Item Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE ORDER
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Order1.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
