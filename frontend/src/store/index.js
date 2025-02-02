import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import purchaseReducer from "../features/purchases/purchaseSlice";
import supplierReducer from "../features/suppliers/supplierSlice";
import categoryReducer from "../features/categories/categorySlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        purchases: purchaseReducer,
        suppliers: supplierReducer,
        categories: categoryReducer,
    },
});

export default store;
