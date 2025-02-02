<?php

namespace App\Repositories;

use App\Interfaces\PurchaseRepositoryInterface;
use App\Models\Purchase;

use App\Models\Product;
use App\Models\PurchaseItem;
use Illuminate\Support\Facades\DB;

class PurchaseRepository implements PurchaseRepositoryInterface
{
    public function index()
    {
        return Purchase::with(['supplier', 'purchaseItems.product'])->latest()->get();
    }

    public function getById($id)
    {
        return Purchase::with(['supplier', 'purchaseItems.product'])->findOrFail($id);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $purchase = Purchase::findOrFail($id);

            $purchase->delete();

            $this->deletePurchaseItems($id);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deletePurchaseItems($purchaseId)
    {
        return PurchaseItem::where('purchase_id', $purchaseId)->delete();
    }


    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $items = $data['purchase_items'] ?? [];
            unset($data['purchase_items']);
            $purchase = Purchase::findOrFail($id);

            $purchase->update([
                'supplier_id'   => $data['supplier_id'],
                'purchase_date' => $data['purchase_date'],
                'total_amount'  => 0,
            ]);

            $totalAmount = $this->updatePurchaseItems($items, $purchase->id);


            $purchase->update(['total_amount' => $totalAmount]);

            DB::commit();
            return $purchase;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function store(array $data)
    {
        DB::beginTransaction();
        try {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $purchase = Purchase::create($data);

            $totalAmount = $this->storePurchaseItems($items, $purchase->id);



            $purchase->update(['total_amount' => $totalAmount]);


            DB::commit();
            return $purchase;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function storePurchaseItems(array $items, $purchaseId)
    {
        $totalAmount = 0;
        $purchaseItems = [];

        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);

            $totalPrice = $item['quantity'] * $item['unit_price'];
            $totalAmount += $totalPrice;

            $purchaseItems[] = [
                'purchase_id' => $purchaseId,
           //     'product' => $product,
                'product_id'  => $item['product_id'],
                'quantity'    => $item['quantity'],
                'unit_price'  => $item['unit_price'],
                'total_price' => $totalPrice,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];


            $this->updateProductStock($item['product_id'], $item['quantity']);
        }

        PurchaseItem::insert($purchaseItems);
        return $totalAmount;
    }

    public function updatePurchaseItems(array $items, $purchaseId)
    {
        $totalAmount = 0;

        $existingItems = PurchaseItem::where('purchase_id', $purchaseId)->get();

        $existingItemIds = $existingItems->pluck('product_id')->toArray();


        $updatedItemIds = [];

        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $totalPrice = $item['quantity'] * $item['unit_price'];
            $totalAmount += $totalPrice;

            if (!empty($item['purchase_item_id'])) {
                // Update existing item
                $purchaseItem = PurchaseItem::findOrFail($item['purchase_item_id']);
                $previousQuantity = $purchaseItem->quantity;
                $purchaseItem->update([
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                    'total_price' => $totalPrice,
                ]);

                // Update stock
                $this->adjustProductStock($item['product_id'], $previousQuantity, $item['quantity']);
                $updatedItemIds[] = $item['purchase_item_id'];
            } else {
                // Add new purchase item
                $newPurchaseItem = PurchaseItem::create([
                    'purchase_id' => $purchaseId,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                    'total_price' => $totalPrice,
                ]);

                $this->updateProductStock($item['product_id'], $item['quantity']);
                $updatedItemIds[] = $newPurchaseItem->id;
            }
        }

        // Delete removed purchase items
        $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
        if (!empty($itemsToDelete)) {
            PurchaseItem::whereIn('product_id', $itemsToDelete)->delete();
        }

        return $totalAmount;
    }

    private function adjustProductStock($productId, $oldQuantity, $newQuantity)
    {
        $difference = $newQuantity - $oldQuantity;
        if ($difference != 0) {
            Product::where('product_id', $productId)->increment('current_stock_quantity', $difference);
        }
    }

    public function updateProductStock($productId, $quantity)
    {
        return Product::where('product_id', $productId)->increment('current_stock_quantity', $quantity);
    }

    public function updatePurchaseTotal($purchaseId, $totalAmount)
    {
        return Purchase::where('id', $purchaseId)->update(['total_amount' => $totalAmount]);
    }

}
