<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CCosts extends Model
{
	protected $table = 'ccosts';

	protected $fillable = [
	    'id', 'name',
	];

    public function costs()
    {
        return $this->belongsToMany(Costs::class, 'ccosts_costs', 'ccosts_id', 'costs_id');
    }
}
