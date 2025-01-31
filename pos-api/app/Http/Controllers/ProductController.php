<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Interfaces\ProductRepositoryInterface;
use App\Classes\ApiResponseClass;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{

    private ProductRepositoryInterface $productRepositoryInterface;

    public function __construct(ProductRepositoryInterface $productRepositoryInterface)
    {
        $this->productRepositoryInterface = $productRepositoryInterface;
    }

    public function index()
    {
        $data = $this->productRepositoryInterface->index();

        return ApiResponseClass::sendResponse(ProductResource::collection($data),'',200);
    }


    public function store(StoreProductRequest $request): ?\Illuminate\Http\JsonResponse
    {

//        dd($request->all());
        $details =[
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'category_id'=>$request->category_id,
            'initial_stock_quantity'=>$request->initial_stock_quantity,
            'current_stock_quantity'=>$request->current_stock_quantity,
        ];
        DB::beginTransaction();
        try{
            $product = $this->productRepositoryInterface->store($details);

            DB::commit();
            return ApiResponseClass::sendResponse(new ProductResource($product),'Product Create Successful',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }


    public function show($id)
    {
        $product = $this->productRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse(new ProductResource($product),'',200);
    }



    public function update(UpdateProductRequest $request, $id)
    {

        $updateDetails =[
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'category_id'=>$request->category_id,
            'initial_stock_quantity'=>$request->initial_stock_quantity,
            'current_stock_quantity'=>$request->current_stock_quantity,
        ];
        DB::beginTransaction();
        try{
            $product = $this->productRepositoryInterface->update($updateDetails,$id);

            DB::commit();
            return ApiResponseClass::sendResponse('Product Update Successful','',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }


    public function destroy($id)
    {
        $this->productRepositoryInterface->delete($id);

        return ApiResponseClass::sendResponse('Product Delete Successful','',204);
    }
}
