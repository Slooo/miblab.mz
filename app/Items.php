<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Items extends Model
{
    protected $table = 'items';
  	
    protected $fillable = [
        'id', 'barcode', 'name', 'price', 'status', 'point',
    ];

    public function orders()
    {
        return $this->belongsToMany(Orders::class)->withPivot('id', 'items_price', 'items_quantity', 'items_sum');
    }

    public function supply()
    {
        return $this->belongsToMany(Supply::class)->withPivot('id', 'items_price', 'items_quantity', 'items_sum');
    }

    public function pivot()
    {
        return $this->hasOne(ItemsOrders::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }
}