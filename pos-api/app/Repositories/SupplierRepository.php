<?php

namespace App\Repositories;

use App\Interfaces\SupplierRepositoryInterface;
use App\Models\Supplier;


class SupplierRepository implements SupplierRepositoryInterface
{
    public function index()
    {
        return Supplier::all();
    }

    public function getById($id)
    {
        return Supplier::findOrFail($id);
    }

    public function store(array $data)
    {
        return Supplier::create($data);
    }

    public function update(array $data, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);
        return $supplier;

    }

    public function delete($id)
    {
        return Supplier::destroy($id);
    }
}
