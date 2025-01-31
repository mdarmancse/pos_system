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
        return Purchase::with(['supplier', 'purchaseItems.product'])->get();
    }

    public function getById($id)
    {
        return Purchase::with(['supplier', 'purchaseItems.product'])->findOrFail($id);
    }



    public function update(array $data, $id)
    {
        DB::beginTransaction();
        try {
            $purchase = Purchase::findOrFail($id);
            $purchase->update($data);

            DB::commit();
            return $purchase;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $purchase = Purchase::findOrFail($id);


            $purchase->purchaseItems()->delete();


            $purchase->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function deletePurchaseItems($purchaseId)
    {
        return PurchaseItem::where('id', $purchaseId)->delete();
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

    public function updateProductStock($productId, $quantity)
    {
        return Product::where('product_id', $productId)->increment('current_stock_quantity', $quantity);
    }

    public function updatePurchaseTotal($purchaseId, $totalAmount)
    {
        return Purchase::where('id', $purchaseId)->update(['total_amount' => $totalAmount]);
    }

}
