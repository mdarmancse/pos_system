<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Resources\PurchaseResource;

use App\Interfaces\PurchaseRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    private PurchaseRepositoryInterface $purchaseRepositoryInterface;

    public function __construct(PurchaseRepositoryInterface $purchaseRepositoryInterface)
    {
        $this->purchaseRepositoryInterface = $purchaseRepositoryInterface;
    }

    /**
     * List all purchases.
     */
    public function index(): JsonResponse
    {
        $data = $this->purchaseRepositoryInterface->index();
        return ApiResponseClass::sendResponse(PurchaseResource::collection($data), '', 200);
    }

    /**
     * Store a new purchase order with items.
     */
    public function store(StorePurchaseRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $purchaseDetails = [
                'supplier_id'    => $request->supplier_id,
                'purchase_date'  => $request->purchase_date,
                'total_amount'   => 0,
            ];

            $purchase = $this->purchaseRepositoryInterface->store($purchaseDetails);

            $items = $request->purchase_items;
            $purchase->total_amount = $this->purchaseRepositoryInterface->storePurchaseItems($items, $purchase->id);


            $this->purchaseRepositoryInterface->updatePurchaseTotal($purchase->id, $purchase->total_amount);


            DB::commit();
            return ApiResponseClass::sendResponse(new PurchaseResource($purchase), 'Purchase Created Successfully', 201);
        } catch (\Exception $ex) {

            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Show a purchase order with items.
     */
    public function show($id): JsonResponse
    {
        $purchase = $this->purchaseRepositoryInterface->getById($id);
        return ApiResponseClass::sendResponse(new PurchaseResource($purchase), '', 200);
    }

    /**
     * Update a purchase order and its items.
     */
    public function update(UpdatePurchaseRequest $request, $id): JsonResponse
    {

        DB::beginTransaction();
        try {

            $updateDetails = [
                'supplier_id'   => $request->supplier_id,
                'purchase_date' => $request->purchase_date,
                'total_amount'  => 0,
            ];


            $purchase = $this->purchaseRepositoryInterface->update($updateDetails, $id);



            $totalAmount = $this->purchaseRepositoryInterface->updatePurchaseItems($request->purchase_items, $purchase->id);

            // Update the total amount in the database
            $this->purchaseRepositoryInterface->updatePurchaseTotal($purchase->id, $totalAmount);

            DB::commit();

            return ApiResponseClass::sendResponse(new PurchaseResource($purchase), 'Purchase Updated Successfully', 200);
        } catch (\Exception $ex) {
            DB::rollBack();
            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Delete a purchase order and its items.
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->purchaseRepositoryInterface->deletePurchaseItems($id);
            $this->purchaseRepositoryInterface->delete($id);

            DB::commit();
            return ApiResponseClass::sendResponse('Purchase Deleted Successfully', '', 204);

        } catch (\Exception $ex) {
            DB::rollback();
            return ApiResponseClass::rollback($ex);
        }
    }
}
