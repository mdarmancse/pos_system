import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {toast} from "react-toastify";


const API_URL = "http://127.00.1:8000/api/purchase";

// Fetch Purchases
export const fetchPurchases = createAsyncThunk('purchases/fetchPurchases', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});



export const addPurchase = createAsyncThunk(
    "purchases/add",
    async (product, { dispatch }) => {
        const response = await axios.post(API_URL, product);
        dispatch(fetchPurchases());
        toast.success("Purchase added successfully!");
        return response.data;
    }
);


export const updatePurchase = createAsyncThunk(
    "purchases/update",
    async ({ id, data }, { dispatch }) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        dispatch(fetchPurchases());
        toast.success("Purchase updated successfully!");
        return response.data;
    }
);

// Delete Purchase
export const deletePurchase = createAsyncThunk('purchases/deletePurchase', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});


const purchaseSlice = createSlice({
    name: 'purchases',
    initialState: {
        purchases: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Purchases
            .addCase(fetchPurchases.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPurchases.fulfilled, (state, action) => {
                state.loading = false;
                state.purchases = action.payload;
            })
            .addCase(fetchPurchases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add Purchase
            .addCase(addPurchase.pending, (state) => {
                state.loading = true;
            })
            .addCase(addPurchase.fulfilled, (state, action) => {
                state.loading = false;
                state.purchases.data.push(action.payload);
            })
            .addCase(addPurchase.rejected, (state) => {
                state.loading = false;
                toast.error("Failed to add purchase");
            })


            .addCase(updatePurchase.fulfilled, (state, action) => {
                const index = state.purchases.data.findIndex((purchase) => purchase.purchase_id === action.payload.purchase_id);
                if (index !== -1) {
                    state.purchases.data[index] = action.payload;
                }
            })

            // Delete Purchase
            .addCase(deletePurchase.fulfilled, (state, action) => {
                const index = state.purchases.data.findIndex((purchase) => purchase.purchase_id === action.payload.purchase_id);
                if (index !== -1) {
                    state.purchases.data[index] = action.payload;
                }
            });
    },
});

export default purchaseSlice.reducer;
