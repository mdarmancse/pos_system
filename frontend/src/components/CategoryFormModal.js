import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {useEffect, useState} from "react";
import {addCategories, updateCategories} from "../features/categories/categorySlice";

const CategoryFormModal = ({ show, handleClose, category }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        if (category) {

            setFormData({
                name: category.name,
                description: category.description,
            });
        } else {
            setFormData({ name: "", description: "" });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (category) {
            dispatch(updateCategories({ id: category.category_id, data: formData }));
        } else {
            dispatch(addCategories(formData));
        }
        setFormData({ name: "", description: "" });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{category ? "Edit category" : "Add category"}</Modal.Title>
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
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        {category ? "Update Category" : "Add Category"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CategoryFormModal;
