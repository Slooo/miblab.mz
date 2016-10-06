<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{	
	protected $table = 'orders';
  	
    protected $fillable = [
        'id', 'sum', 'sum_discount', 'type',
    ];

    public function items()
    {
        return $this->belongsToMany(Items::class)->withPivot('items_price', 'items_quantity', 'items_sum');
    }
}
