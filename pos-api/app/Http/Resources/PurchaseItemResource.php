<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = Product::findOrfail($this->product_id);;
        return [
            'purchase_item_id' => $this->purchase_item_id,
            'purchase_id'      => $this->purchase_id,
            'product'          => new ProductResource($product),
            'quantity'         => $this->quantity,
            'unit_price'       => $this->unit_price,
            'total_price'      => $this->total_price,
            'created_at'       => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'       => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
