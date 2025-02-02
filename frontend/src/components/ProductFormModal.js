import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "../features/products/productSlice";
import axios from "axios";

const API_CATEGORIES = "http://127.00.1:8000/api/categories";

const ProductFormModal = ({ show, handleClose, product }) => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        price: "",
        initial_stock_quantity: "",
        current_stock_quantity: "",
        category_id: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                price: product.price,
                initial_stock_quantity: product.initial_stock_quantity,
                current_stock_quantity: product.current_stock_quantity,
                category_id: product.category_id || "",
            });
        } else {
            setFormData({
                name: "",
                sku: "",
                price: "",
                initial_stock_quantity: "",
                current_stock_quantity: "",
                category_id: "",
            });
        }
    }, [product]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(API_CATEGORIES);

                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();

    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product) {
            dispatch(updateProduct({ id: product.product_id, data: formData })).then(() => {
                dispatch(fetchProducts());
                handleClose();
            });
        } else {
            dispatch(addProduct(formData)).then(() => {
                dispatch(fetchProducts());
                handleClose();
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product ? "Edit Product" : "Add Product"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>SKU</Form.Label>
                        <Form.Control
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price (BDT)</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Initial Stock Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="initial_stock_quantity"
                            value={formData.initial_stock_quantity}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Current Stock Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="current_stock_quantity"
                            value={product?formData.current_stock_quantity : formData.initial_stock_quantity}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>



                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category_id" value={formData.category_id} onChange={handleChange} required>
                            <option value="">Select a Category</option>
                            {categories?.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {product ? "Update Product" : "Add Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;
