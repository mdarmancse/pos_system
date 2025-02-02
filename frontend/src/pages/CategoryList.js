import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import CategoryFormModal from "../components/CategoryFormModal";
import {deleteCategories, fetchcategories} from "../features/categories/categorySlice";
import AdminLayout from "../layouts/AdminLayout";
import {toast} from "react-toastify";

const CategoryList = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchcategories());
    }, [dispatch]);

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategories(id))
                .then(() => {
                    toast.success("Category deleted successfully!");
                    dispatch(fetchcategories());
                })
                .catch((err) => toast.error("Failed to delete category."));
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Categories</h2>
                <Button variant="primary" onClick={handleAddCategory}>
                    <FaPlus /> Add Category
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditCategory(category)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(category.category_id)}
                                >
                                    <FaTrash/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <CategoryFormModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                category={selectedCategory}
            />
        </AdminLayout>
    );
};

export default CategoryList;
