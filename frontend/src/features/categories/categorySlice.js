import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";



const API_URL = "http://127.00.1:8000/api/categories";


export const fetchcategories = createAsyncThunk("categories/fetch", async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addCategories = createAsyncThunk("categories/add", async (CategoriesData) => {
    const response = await axios.post(API_URL, CategoriesData);
    toast.success("Categories added successfully!");
    return response.data.data;
});


export const updateCategories = createAsyncThunk(
    "categories/update",
    async ({ id, data }, { dispatch }) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        dispatch(fetchcategories());
        toast.success("Product updated successfully!");
        return response.data;
    }
);



export const deleteCategories = createAsyncThunk("categories/delete", async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    toast.success("Categories deleted successfully!");
    return id;
});


const initialState = {
    categories: [],
    loading: false,
    error: null,
};


const categorieslice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchcategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error("Failed to fetch categories");
            })

            // Add Categories
            .addCase(addCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addCategories.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to add categories";
                toast.error("Failed to add categories");
            })

            // Update Categories
            .addCase(updateCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategories.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((Categories) => Categories.Categories_id === action.payload.Categories_id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategories.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to update categories";
                toast.error("Failed to update categories");
            })

            // Delete Categories
            .addCase(deleteCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategories.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((Categories) => Categories.Categories_id === action.payload.Categories_id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategories.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to delete categories";
                toast.error("Failed to delete categories");
            });
    },
});

export default categorieslice.reducer;
