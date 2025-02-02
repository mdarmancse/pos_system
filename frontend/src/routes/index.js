import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "../pages/Products";
import PurchaseList from "../pages/PurchaseList";
import Suppliers from "../pages/Suppliers";
import CategoryList from "../pages/CategoryList";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Products />} />
                <Route path="/categories" element={<CategoryList/>} />
                <Route path="/suppliers" element={<Suppliers/>} />
                <Route path="/purchases" element={<PurchaseList/>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
