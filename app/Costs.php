<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Costs extends Model
{
    protected $table = 'costs';

    protected $fillable = [
        'id', 'sum', 'date', 'created_at', 'updated_at',
    ];

    public function ccosts()
    {
        return $this->belongsToMany(CCosts::class, 'ccosts_costs', 'costs_id', 'ccosts_id');
    }
}
