import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        default: null
    },
    lng: {
        type: Number,
        default: null
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
