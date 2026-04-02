import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders : []
}

const orderSlice = createSlice({
    name : "order",
    initialState : initialState,
    reducers : {
        handleSetOrders : (state,action)=>{
           state.orders = [...action.payload]
        },
    }
})

export const { handleSetOrders } = orderSlice.actions

export default orderSlice.reducer

