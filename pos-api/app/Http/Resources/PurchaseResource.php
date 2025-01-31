<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'purchase_id'    => $this->id,
            'supplier'       => new SupplierResource($this->supplier),
            'total_amount'   => $this->total_amount,
            'purchase_date'  => $this->purchase_date,
            'created_at'     => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'     => $this->updated_at->format('Y-m-d H:i:s'),
            'purchase_items' => PurchaseItemResource::collection($this->purchaseItems),
        ];
    }
}
