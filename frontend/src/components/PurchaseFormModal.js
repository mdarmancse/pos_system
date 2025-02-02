import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { fetchSuppliers } from "../features/suppliers/supplierSlice";
import { addPurchase, updatePurchase } from "../features/purchases/purchaseSlice";
import { fetchProducts } from "../features/products/productSlice";

const PurchaseFormModal = ({ show, handleClose, purchase }) => {
    const dispatch = useDispatch();
    const { suppliers } = useSelector((state) => state.suppliers);
    const { products } = useSelector((state) => state.products);

    const [formData, setFormData] = useState({
        supplier_id: "",
        purchase_date: "",
        purchase_items: [],
        total_amount: 0,
    });

    // Fetch suppliers & products when modal opens
    useEffect(() => {
        dispatch(fetchSuppliers());
        dispatch(fetchProducts());
    }, [dispatch]);

    // Pre-fill form if editing
    useEffect(() => {
        if (purchase) {
            setFormData({
                supplier_id: purchase.supplier?.supplier_id || "",
                purchase_date: purchase.purchase_date || "",
                purchase_items: purchase.purchase_items.map(item => ({
                    product_id: item.product?.product_id || "",
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.total_price,
                })),
                total_amount: purchase.total_amount || 0,
            });
        } else {
            setFormData({
                supplier_id: "",
                purchase_date: "",
                purchase_items: [],
                total_amount: 0,
            });
        }
    }, [purchase]);

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle adding new product row
    const addProductRow = () => {
        setFormData({
            ...formData,
            purchase_items: [
                ...formData.purchase_items,
                { product_id: "", quantity: 1, unit_price: 0, total_price: 0 },
            ],
        });
    };

    // Handle product field changes
    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        let updatedItems = [...formData.purchase_items];

        if (name === "product_id") {
            // Find the selected product
            const selectedProduct = products.data.find(
                (product) => product.product_id === parseInt(value)
            );
            if (selectedProduct) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    product_id: selectedProduct.product_id,
                    unit_price: selectedProduct.price, // Auto-fill unit price
                    total_price: selectedProduct.price * updatedItems[index].quantity,
                };
            }
        } else {
            updatedItems[index] = { ...updatedItems[index], [name]: parseFloat(value) || 0 };
            updatedItems[index].total_price =
                updatedItems[index].unit_price * updatedItems[index].quantity;
        }

        setFormData({ ...formData, purchase_items: updatedItems });
        calculateTotalAmount(updatedItems);
    };

    // Handle removing product row
    const removeProductRow = (index) => {
        const updatedItems = formData.purchase_items.filter((_, i) => i !== index);
        setFormData({ ...formData, purchase_items: updatedItems });
        calculateTotalAmount(updatedItems);
    };

    // Calculate total amount

    const calculateTotalAmount = (items) => {
        const total = items.reduce((acc, item) => acc + parseFloat(item.total_price), 0);
        setFormData((prev) => ({ ...prev, total_amount: parseFloat(total.toFixed(2)) }));
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (purchase) {
            dispatch(updatePurchase({ id: purchase.purchase_id, data: formData }));
        } else {
            dispatch(addPurchase(formData));
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size={"xl"}>
            <Modal.Header closeButton>
                <Modal.Title>{purchase ? "Edit Purchase" : "Add Purchase"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Supplier</Form.Label>
                        <Form.Control
                            as="select"
                            name="supplier_id"
                            value={formData.supplier_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Purchase Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="purchase_date"
                            value={formData.purchase_date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {formData.purchase_items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        as="select"
                                        name="product_id"
                                        value={item.product_id}
                                        onChange={(e) => handleProductChange(index, e)}
                                    >
                                        <option value="">Select Product</option>
                                        {products.data.map((product) => (
                                            <option key={product.product_id} value={product.product_id}>
                                                {product.name} - {product.sku}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleProductChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        name="unit_price"
                                        value={item.unit_price}
                                        onChange={(e) => handleProductChange(index, e)}

                                    />
                                </td>
                                <td>{item.total_price}</td>
                                <td>
                                    <Button variant="danger" onClick={() => removeProductRow(index)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <Button variant="primary" onClick={addProductRow}>
                        <FaPlus /> Add Product
                    </Button>

                    <div className="mt-3">
                        <strong>Total Amount: </strong>
                        {formData.total_amount}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {purchase ? "Update Purchase" : "Add Purchase"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PurchaseFormModal;
