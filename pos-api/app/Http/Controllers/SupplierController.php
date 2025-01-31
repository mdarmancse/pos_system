<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Interfaces\SupplierRepositoryInterface;
use App\Classes\ApiResponseClass;
use App\Http\Resources\SupplierResource;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    private SupplierRepositoryInterface $supplierRepositoryInterface;

    public function __construct(SupplierRepositoryInterface $supplierRepositoryInterface)
    {
        $this->supplierRepositoryInterface = $supplierRepositoryInterface;
    }

    public function index()
    {
        $data = $this->supplierRepositoryInterface->index();
        return ApiResponseClass::sendResponse(SupplierResource::collection($data), '', 200);
    }

    public function store(StoreSupplierRequest $request)
    {
        $details = [
            'name' => $request->name,
            'contact_info' => $request->contact_info,
            'address' => $request->address,
        ];
        DB::beginTransaction();
        try {
            $supplier = $this->supplierRepositoryInterface->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new SupplierResource($supplier), 'Supplier Created Successfully', 201);
        } catch (\Exception $ex) {
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $supplier = $this->supplierRepositoryInterface->getById($id);
        return ApiResponseClass::sendResponse(new SupplierResource($supplier), '', 200);
    }

    public function update(UpdateSupplierRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
            'contact_info' => $request->contact_info,
            'address' => $request->address,
        ];

        DB::beginTransaction();
        try {
            $this->supplierRepositoryInterface->update($updateDetails, $id);
            DB::commit();
            return ApiResponseClass::sendResponse('Supplier Updated Successfully', '', 201);
        } catch (\Exception $ex) {
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->supplierRepositoryInterface->delete($id);
        return ApiResponseClass::sendResponse('Supplier Deleted Successfully', '', 204);
    }
}
