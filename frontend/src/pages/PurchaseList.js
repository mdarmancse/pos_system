import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchases, deletePurchase } from "../features/purchases/purchaseSlice";
import {Table, Button, Spinner} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";

import PurchaseFormModal from "../components/PurchaseFormModal";
import {toast} from "react-toastify";



const PurchaseList = () => {
    const dispatch = useDispatch();
    const { purchases, loading, error } = useSelector((state) => state.purchases);
    const [showModal, setShowModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    useEffect(() => {
        dispatch(fetchPurchases());
    }, [dispatch]);

    useEffect(() => {
        if (purchases.data && purchases.data.length > 0) {
            setTimeout(() => {
                $("#purchaseTable").DataTable({
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
    }, [purchases]);

    const handleAddPurchase = () => {
        setSelectedPurchase(null);
        setShowModal(true);
    };

    const handleEditPurchase = (purchase) => {
        setSelectedPurchase(purchase);
        setShowModal(true);
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this purchase?")) {
            dispatch(deletePurchase(id))
                .then(() => {
                    toast.success("Purchase deleted successfully!");
                    dispatch(fetchPurchases());
                })
                .catch((err) => toast.error("Failed to delete purchase."));
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Purchases</h2>
                <Button variant="primary" onClick={handleAddPurchase}>
                    <FaPlus /> Add Purchase
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border"/>
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : purchases.length === 0 ? (
                <p>No Purchases available.</p>
                ) :(
                <Table id="purchaseTable" striped bordered hover responsive className="datatable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Supplier</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchases.data?.map((purchase) => (
                        <tr key={purchase.purchase_id}>
                            <td>{purchase.purchase_id}</td>
                            <td>{purchase.supplier?.name || "N/A"}</td>
                            <td>{purchase.total_amount}</td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleEditPurchase(purchase)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(purchase.purchase_id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <PurchaseFormModal show={showModal} handleClose={() => setShowModal(false)} purchase={selectedPurchase} />
        </AdminLayout>
    );
};

export default PurchaseList;
