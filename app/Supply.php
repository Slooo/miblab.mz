<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Supply extends Model
{
	protected $table = 'supply';
	
    protected $fillable = [
        'id', 'sum', 'sum_discount', 'type', 'counterparty_id', 'points_id', 'created_at', 'updated_at',
    ];

    protected $dates = ['created_at', 'updated_at', 'date'];

    public function items()
    {
        return $this->belongsToMany(Items::class)->withPivot('id', 'items_price', 'items_quantity', 'items_sum');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function pivot()
    {
        return $this->hasOne(ItemsSupply::class);
    }

    public function getDateFormatAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y');
    }
}