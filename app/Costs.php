<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Costs extends Model
{
    protected $table = 'costs';

    protected $fillable = [
        'id', 'sum', 'date', 'point'
    ];

    protected $dates = ['date', 'created_at', 'updated_at'];

    public function ccosts()
    {
        return $this->belongsToMany(CCosts::class, 'ccosts_costs', 'costs_id', 'ccosts_id');
    }

    public function getDateFormatAttribute()
    {
        return Carbon::parse($this->attributes['date'])->format('d/m/Y');
    }

    public function pivot()
    {
        return $this->hasOne(CCostsCosts::class);
    }
}