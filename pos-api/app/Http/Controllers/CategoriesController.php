<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Interfaces\CategoryRepositoryInterface;
use App\Classes\ApiResponseClass;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\DB;

class CategoriesController extends Controller
{
    private CategoryRepositoryInterface $categoryRepositoryInterface;

    public function __construct(CategoryRepositoryInterface $categoryRepositoryInterface)
    {
        $this->categoryRepositoryInterface = $categoryRepositoryInterface;
    }

    public function index()
    {
        $data = $this->categoryRepositoryInterface->index();
        return ApiResponseClass::sendResponse(CategoryResource::collection($data), '', 200);
    }

    public function store(StoreCategoryRequest $request)
    {
        $details = [
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try {
            $category = $this->categoryRepositoryInterface->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new CategoryResource($category), 'Category Created Successfully', 201);
        } catch (\Exception $ex) {
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $category = $this->categoryRepositoryInterface->getById($id);
        return ApiResponseClass::sendResponse(new CategoryResource($category), '', 200);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try {
            $this->categoryRepositoryInterface->update($updateDetails, $id);
            DB::commit();
            return ApiResponseClass::sendResponse('Category Updated Successfully', '', 201);
        } catch (\Exception $ex) {
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->categoryRepositoryInterface->delete($id);
        return ApiResponseClass::sendResponse('Category Deleted Successfully', '', 204);
    }
}
