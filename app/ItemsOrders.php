<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class ItemsOrders extends Model
{
	protected $table = 'items_orders';

	protected $dates = ['created_at', 'updated_at'];

    public function getDateFormatAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y');
    }
}
