import OrderModel from "../models/orderModel.js"
import CartProductModel from "../models/cartproductModel.js"
import UserModel from "../models/userModel.js"

export const placeOrderController = async (request, response) => {
    try {
        const userId = request.userId
        const { paymentMethod, totalAmount } = request.body

        if (!paymentMethod || !totalAmount) {
            return response.status(400).json({
                message: "Provide paymentMethod and totalAmount",
                error: true,
                success: false
            })
        }

        // Get user's cart items with populated products
        const cartItems = await CartProductModel.find({ userId }).populate({
          path: "productId",
          select: "name price discount image unit"
        })
        
        if (!cartItems.length) {
            return response.status(400).json({
                message: "Cart is empty",
                error: true,
                success: false
            })
        }

        // Transform cart items to order items (snapshot prices)
        const items = cartItems.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
            discount: item.productId.discount || 0
        }))

        // Create order
        // Get user's first/default address
        const user = await UserModel.findById(userId).populate('address_details')
        const deliveryAddressId = user.address_details?.find(addr => addr.isDefault)?._id || user.address_details[0]?._id
        
        const order = new OrderModel({
            userId,
            items,
            paymentMethod,
            totalAmount,
            deliveryAddress: deliveryAddressId,  // ✅ Set address for admin
            paymentStatus: paymentMethod === "COD" ? "cod" : "pending"
        })

        const savedOrder = await order.save()

        // Add to user's orderHistory
        await UserModel.updateOne(
            { _id: userId },
            { $push: { orderHistory: savedOrder._id } }
        )

        // Clear user's cart
        await CartProductModel.deleteMany({ userId })

        return response.json({
            data: savedOrder,
            message: "Order placed successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getUserOrdersController = async (request, response) => {
    try {
        const userId = request.userId

        const orders = await OrderModel.find({ userId })
            .populate("items.productId")
            .populate("userId", "name email")
            .sort({ createdAt: -1 })

        return response.json({
            data: orders,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const clearCartController = async (request, response) => {
    try {
        const userId = request.userId

        const result = await CartProductModel.deleteMany({ userId })

        return response.json({
            message: "Cart cleared successfully",
            data: result,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateOrderStatusController = async (request, response) => {
    try {
        const { status } = request.body
        const { id } = request.params

if (!['pending', 'confirmed', 'dispatched', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return response.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            })
        }

        const order = await OrderModel.findById(id)
        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        order.status = status
        const updatedOrder = await order.save()

        return response.json({
            data: updatedOrder,
            message: "Order status updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAllOrdersController = async (request, response) => {
    try {
        let query = {};

        // Filters
        if (request.query.status) {
          query.status = request.query.status;
        }
        if (request.query.dateFrom) {
          query.createdAt = { $gte: new Date(request.query.dateFrom) };
        }
        if (request.query.dateTo) {
          if (!query.createdAt) query.createdAt = {};
          query.createdAt.$lte = new Date(request.query.dateTo);
        }
        if (request.query.search) {
          query['userId.name'] = { $regex: request.query.search, $options: 'i' };
        }

        const orders = await OrderModel.find(query)
            .populate("items.productId", "name price image")
            .populate("deliveryAddress", "street city state pincode")
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 })

        return response.json({
            data: orders,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

