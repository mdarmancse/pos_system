import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addSupplier, updateSupplier } from "../features/suppliers/supplierSlice";
import {useEffect, useState} from "react";

const SupplierFormModal = ({ show, handleClose, supplier }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        contact_info: "",
        address: "",
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contact_info: supplier.contact_info,
                address: supplier.address,
            });
        } else {
            setFormData({ name: "", contact_info: "", address: "" });
        }
    }, [supplier]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (supplier) {
            dispatch(updateSupplier({ id: supplier.supplier_id, data: formData }));
        } else {
            dispatch(addSupplier(formData));
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{supplier ? "Edit Supplier" : "Add Supplier"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Info</Form.Label>
                        <Form.Control
                            type="text"
                            name="contact_info"
                            value={formData.contact_info}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        {supplier ? "Update Supplier" : "Add Supplier"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SupplierFormModal;
