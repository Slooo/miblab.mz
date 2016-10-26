<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Supply extends Model
{
	protected $table = 'supply';
	
    protected $fillable = [
        'id', 'sum', 'sum_discount', 'type',
    ];

    public $timestamps = false;

    protected $dates = ['date'];

    public function items()
    {
        return $this->belongsToMany(Items::class)->withPivot('point', 'items_price', 'items_quantity', 'items_sum', 'created_at');
    }

    public function pivot()
    {
        return $this->hasOne(ItemsSupply::class);
    }

}