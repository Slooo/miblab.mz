<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stock';

    protected $fillable = [
        'items_id', 'items_quantity', 'points_id',
    ];

    public function items()
	{
        return $this->hasOne(Items::class);
    }


}
