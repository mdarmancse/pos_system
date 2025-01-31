<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id'   => $this->product_id,
            'name'         => $this->name,
            'sku'          => $this->sku,
            'price'        => $this->price,
            'category_id'  => $this->category_id,
            'current_stock_quantity' => $this->current_stock_quantity,
        ];
    }
}
