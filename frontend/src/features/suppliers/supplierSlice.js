import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";



const API_URL = "http://127.00.1:8000/api/suppliers";


export const fetchSuppliers = createAsyncThunk("suppliers/fetch", async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addSupplier = createAsyncThunk("suppliers/add", async (supplierData) => {
    const response = await axios.post(API_URL, supplierData);
    toast.success("Supplier added successfully!");
    return response.data.data;
});


export const updateSupplier = createAsyncThunk(
    "suppliers/update",
    async ({ id, data }, { dispatch }) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        dispatch(fetchSuppliers());
        toast.success("Product updated successfully!");
        return response.data;
    }
);


export const deleteSupplier = createAsyncThunk("suppliers/delete", async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    toast.success("Supplier deleted successfully!");
    return id;
});


const initialState = {
    suppliers: [],
    loading: false,
    error: null,
};


const supplierSlice = createSlice({
    name: "suppliers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Suppliers
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.suppliers = action.payload;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error("Failed to fetch suppliers");
            })

            // Add Supplier
            .addCase(addSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSupplier.fulfilled, (state, action) => {
                state.loading = false;
                state.suppliers.push(action.payload);
            })
            .addCase(addSupplier.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to add suppliers";
                toast.error("Failed to add suppliers");
            })

            // Update Supplier
            .addCase(updateSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.suppliers.findIndex((supplier) => supplier.supplier_id === action.payload.supplier_id);
                if (index !== -1) {
                    state.suppliers[index] = action.payload;
                }
            })
            .addCase(updateSupplier.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to update suppliers";
                toast.error("Failed to update suppliers");
            })

            // Delete Supplier
            .addCase(deleteSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.suppliers.findIndex((supplier) => supplier.supplier_id === action.payload.supplier_id);
                if (index !== -1) {
                    state.suppliers[index] = action.payload;
                }
            })
            .addCase(deleteSupplier.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to delete suppliers";
                toast.error("Failed to delete suppliers");
            });
    },
});

export default supplierSlice.reducer;
