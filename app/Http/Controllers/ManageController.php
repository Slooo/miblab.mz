<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use DB;
use Carbon\Carbon;

# models
use App\User;
use App\Orders;
use App\CCosts;
use App\Costs;

class ManageController extends Controller
{
    public function index()
    {
	    # settings
	    $sum_week = []; $date_week = [];

	    $date = Carbon::now();
	    $month = $date->startOfMonth();
	    $days30 = Carbon::today()->subDays(30); #->toDateString();

	    $start = Carbon::today()->subDay(29);
	    for ($i = 0; $i < 30; $i++) {
	        $date_week[] = $start->copy();
	        $start->addDay();
	    }

	    # sum 30 days
	    $sum = DB::table('items_orders AS io')
	            ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
	            ->whereBetween('io.created_at', [Carbon::today()->subDays(29), $date])
	            ->sum('o.sum');

	    # week sum 30 days
	    foreach($date_week as $row):
	    $sum_week[] = DB::table('items_orders AS io')
	            ->select(DB::raw("SUM(o.sum) AS sum_week"))
	            ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
	            ->whereDate('io.created_at', '=', $row->format('Y-m-d'))
	            ->groupBy('io.created_at')
	            ->first();
	    endforeach;

	    $ccosts = CCosts::all();
	    $points = User::select('point')->distinct()->where('point', '!=', 0)->get();
	    return view('manage.analytics', compact(
	        'ccosts', 'order', 'points', 'month', 'date', 'days30', 'date_week', 'sum_week', 'sum'
	        ));
    }

   public function orders()
   {
   		$orders = Orders::orderBy('id', 'desc')->get();#->take(10)->get();
   		if(count($orders) > 0)
   		{
   			return view('order.index')->with(['orders' => $orders]);
   		} else {
   			abort(404);
   		}
   		return view('manage.orders', $orders);
   }
}
