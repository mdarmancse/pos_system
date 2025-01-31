<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::apiResource('/categories',CategoriesController::class);
Route::apiResource('/products',ProductController::class);
Route::apiResource('/purchase',PurchaseController::class);
Route::apiResource('/suppliers',SupplierController::class);
