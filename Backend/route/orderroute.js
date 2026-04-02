import { Router } from "express";
import auth from "../middleware/auth.js";
import Admin from "../middleware/Admin.js";
import { 
    placeOrderController, 
    getUserOrdersController, 
    clearCartController,
    updateOrderStatusController,
    getAllOrdersController
} from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post("/place-order", auth, placeOrderController)
orderRouter.get("/get-user-orders", auth, getUserOrdersController)
orderRouter.delete("/clear-cart", auth, clearCartController)

// Admin routes
orderRouter.put("/update-status/:id", Admin, updateOrderStatusController)
orderRouter.get("/get-all-orders", Admin, getAllOrdersController)

export default orderRouter

