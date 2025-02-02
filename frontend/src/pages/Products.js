import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../features/products/productSlice";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";
import ProductFormModal from "../components/ProductFormModal";
import { toast } from "react-toastify";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";


const Products = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (products.data && products.data.length > 0) {
            setTimeout(() => {
                $("#dataTable").DataTable({
                    destroy: true,
                    responsive: true,
                    paging: true,
                    searching: true,
                     ordering: false,
                    autoWidth: false,
                    language: {
                        search: "Search:",
                        lengthMenu: "Show _MENU_ entries",
                    },
                });
            }, 500);
        }
    }, [products]);

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const handleAddProduct = () => {
        setSelectedProduct(null);
        setShowModal(true);
    };


    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };


    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(productId))
                .then(() => {
                    toast.success("Product deleted successfully!");
                    dispatch(fetchProducts());
                })
                .catch((err) => toast.error("Failed to delete product."));
        }
    };


    const productList = Array.isArray(products.data) ? products.data : [];

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Products</h4>
                <Button variant="primary" onClick={handleAddProduct}>
                    <FaPlus /> Add Product
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : productList.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <Table id="dataTable" striped bordered hover responsive className="datatable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price (BDT)</th>
                        <th>Initial Stock</th>
                        <th>Current Stock</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productList.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.category ? product.category.name : "No Category"}</td>
                            <td>BDT {product.price}</td>
                            <td>{product.initial_stock_quantity}</td>
                            <td>{product.current_stock_quantity}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    <FaEdit/>
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(product.product_id)}
                                >
                                    <FaTrash/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <ProductFormModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                product={selectedProduct}
            />
        </AdminLayout>
    );
};

export default Products;
