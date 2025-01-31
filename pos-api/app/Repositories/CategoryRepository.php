<?php

namespace App\Repositories;

use App\Interfaces\CategoryRepositoryInterface;
use App\Models\Categories;


class CategoryRepository implements CategoryRepositoryInterface
{
    public function index(){
        return Categories::all();
    }

    public function getById($id){
        return Categories::findOrFail($id);
    }

    public function store(array $data){
        return Categories::create($data);
    }

    public function update(array $data,$id){
        return Categories::whereId($id)->update($data);
    }

    public function delete($id){
        Categories::destroy($id);
    }
}
