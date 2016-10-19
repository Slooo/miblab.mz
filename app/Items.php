<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Items extends Model
{
    protected $table = 'items';
  	
    protected $fillable = [
        'id', 'barcode', 'name', 'price', 'quantity', 'status', 'point',
    ];

    public function orders()
    {
        return $this->belongsToMany(Orders::class)->withPivot('point', 'items_price', 'items_quantity', 'items_sum', 'created_at');
    }

    public function pivot()
    {
        return $this->hasOne(ItemsOrders::class);
    }
}