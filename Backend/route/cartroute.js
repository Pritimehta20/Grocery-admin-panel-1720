import { Router } from "express";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController, clearCartController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

const cartRouter = Router()

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get("/get",auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemQtyController)
cartRouter.delete('/clear-cart',auth,clearCartController)

export default cartRouter