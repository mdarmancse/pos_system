<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory;

    use SoftDeletes;
    protected $primaryKey = 'supplier_id';
    protected $fillable = [
        'name',
        'contact_info',
        'address',
    ];


}
