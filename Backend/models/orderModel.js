import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    items : [{
        productId : {
            type : mongoose.Schema.ObjectId,
            ref : "product"
        },
        quantity : {
            type : Number,
            default : 1
        },
        price : {
            type : Number,
            required : true
        },
        discount : {
            type : Number,
            default : 0
        }
    }],
    paymentMethod : {
        type : String,
        enum : ["COD", "UPI", "CARD", "NETBANKING"],
        required : true
    },
    paymentStatus : {
        type : String,
        enum : ["pending", "paid", "failed", "cod"],
        default : "pending"
    },
    totalAmount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "confirmed", "dispatched", "shipped", "delivered", "cancelled"],
        default : "pending"
    },
    deliveryAddress : {
        type : mongoose.Schema.ObjectId,
        ref : "address"
    }
},{
    timestamps : true
})

const OrderModel = mongoose.model("order", orderSchema)

export default OrderModel

