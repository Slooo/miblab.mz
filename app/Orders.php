<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Auth;
use Carbon\Carbon;

class Orders extends Model
{	
	protected $table = 'orders';
  	
    protected $fillable = [
        'id', 'sum', 'sum_discount', 'type',
    ];

    public function items()
    {
        return $this->belongsToMany(Items::class)->withPivot('point', 'items_price', 'items_quantity', 'items_sum', 'created_at');
    }

    public function pivot()
    {
        return $this->hasOne(ItemsOrders::class);
    }
}
