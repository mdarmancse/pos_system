import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "../pages/Products";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Products />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;
