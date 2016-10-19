<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Supply extends Model
{
	protected $table = 'supply';
	
    protected $fillable = [
        'name', 'barcode', 'price', 'price_discount', 'quantity', 'point',
    ];

    protected $dates = ['date'];

    public function getDateFormatAttribute($date)
    {
        return Carbon::parse($date)->format('d/m/Y');
    }

}