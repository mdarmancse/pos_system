import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


const API_URL = "http://127.00.1:8000/api/products"; // Change as needed


export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const response = await axios.get(API_URL);
    return response.data;
});


export const addProduct = createAsyncThunk(
    "products/add",
    async (product, { dispatch }) => {
        const response = await axios.post(API_URL, product);
        dispatch(fetchProducts());
        toast.success("Product added successfully!");
        return response.data;
    }
);



export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, data }, { dispatch }) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        dispatch(fetchProducts());
        toast.success("Product updated successfully!");
        return response.data;
    }
);



export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    toast.error("Product deleted successfully!");
    return id;
});

const initialState = {
    products: [],
    loading: false,
    error: null,
};


const productSlice = createSlice({
    name: "products",
    initialState: initialState,
    extraReducers: (builder) => {
        builder

            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.data.push(action.payload);
            })
            .addCase(addProduct.rejected, (state) => {
                state.loading = false;
                toast.error("Failed to add product");
            })


            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.data.findIndex(p => p.product_id === action.payload.product_id);
                if (index !== -1) {
                    state.products.data[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state) => {
                state.loading = false;
            })


            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products.data = state.products.data.filter((product) => product.product_id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default productSlice.reducer;


