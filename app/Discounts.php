<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Discounts extends Model
{
    protected $table = 'discounts';

    protected $fillable = ['sum', 'percent', 'created_at'];
}
