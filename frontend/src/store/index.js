import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
// import supplierReducer from "../features/suppliers/supplierSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        // suppliers: supplierReducer,
    },
});

export default store;
