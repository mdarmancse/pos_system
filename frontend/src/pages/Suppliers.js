import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {deleteSupplier, fetchSuppliers} from "../features/suppliers/supplierSlice";
import SupplierFormModal from "../components/SupplierFormModal";
import AdminLayout from "../layouts/AdminLayout";
import {toast} from "react-toastify";

const SupplierList = () => {
    const dispatch = useDispatch();
    const { suppliers, loading, error } = useSelector((state) => state.suppliers);
    const [showModal, setShowModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        dispatch(fetchSuppliers());
    }, [dispatch]);

    const handleAddSupplier = () => {
        setSelectedSupplier(null);
        setShowModal(true);
    };

    const handleEditSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            dispatch(deleteSupplier(id))
                .then(() => {
                    toast.success("Supplier deleted successfully!");
                    dispatch(fetchSuppliers());
                })
                .catch((err) => toast.error("Failed to delete supplier."));
        }
    };


    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Suppliers</h2>
                <Button variant="primary" onClick={handleAddSupplier}>
                    <FaPlus /> Add Supplier
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : suppliers.length === 0 ? (
                <p>No suppliers available.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact Info</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.supplier_id}>
                            <td>{supplier.supplier_id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact_info}</td>
                            <td>{supplier.address}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditSupplier(supplier)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(supplier.supplier_id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <SupplierFormModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                supplier={selectedSupplier}
            />
        </AdminLayout>
    );
};

export default SupplierList;
