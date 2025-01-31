<?php

namespace App\Interfaces;


interface PurchaseRepositoryInterface
{
    public function index();
    public function getById($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function storePurchaseItems(array $items,$purchaseId);
    public function deletePurchaseItems($purchaseId);

    public function updateProductStock($productId, $quantity);
    public function updatePurchaseTotal($purchaseId, $totalAmount);
}
