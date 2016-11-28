<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class ItemsOrders extends Model
{
	protected $table = 'items_orders';

	protected $fillable = [
	    'id', 'items_id', 'items_price', 'items_quantity', 'items_sum', 'orders_id'
	];

	public $timestamps = false;

	public function pivot()
	{
	    return $this->hasOne(Orders::class);
	}

}