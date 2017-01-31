<?php
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

use Auth;
use Carbon\Carbon;

class Orders extends Model
{	
	protected $table = 'orders';
  	
    protected $fillable = [
        'id', 'sum', 'sum_discount', 'type', 'points_id',
    ];

    public function items()
    {
        return $this->belongsToMany(Items::class)->withPivot('id', 'items_price', 'items_quantity', 'items_sum');
    }

    public function pivot()
    {
        return $this->hasOne(ItemsOrders::class);
    }

    public function getDateFormatAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y');
    }
}
