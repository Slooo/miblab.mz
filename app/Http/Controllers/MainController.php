<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Carbon\Carbon;
use DB;

// models
use App\Points;
use App\Discounts;
use App\Orders;
use App\User;
use App\CCosts;
use App\Costs;
use App\Items;
use App\Supply;
use App\Stock;
use App\ItemsOrders;

class MainController extends Controller
{
    # manage analytics
	public function analytics()
	{
	    # settings
	    $i = -1; $sumAll = []; $sumMonth = []; $sumMonthPoint = []; 
	    $sumAllKey = []; $sumAllKeyPoint = []; $sumWeek = []; $dateWeek = [];

	    $date 	= Carbon::now();
	    $month  = Carbon::now()->startOfMonth();
	    $days30 = Carbon::today()->subDays(29);

	    $start  = Carbon::today()->subDay(29);
	    for ($i = 0; $i < 30; $i++) {
	        $dateWeek[] = $start->copy();
	        $start->addDay();
	    }

	    # all points
	    $points = Points::all();

	    # sum all & month
	    foreach(CCosts::all() as $row):
	    	$i++;

	    	# sum all
	    	$sumAll[$i]['costs'] = $row->name;
	    	$sumAllQuery = Costs::whereHas('ccosts', function($query) use($row, $month){
	    		$query->where('ccosts_costs.ccosts_id', $row->id);
	    	})->sum('sum');

	    	$sumAll[$i]['sum'] = (count($sumAllQuery > 0) ? $sumAllQuery : 0);

	    	# sum month
	    	$sumMonth[$i]['costs'] = $row->name;
	    	$sumMonthQuery = Costs::whereHas('ccosts', function($query) use($row, $month){
	    		$query->where('ccosts_costs.ccosts_id', $row->id)
	    			  ->whereDate('date', '>=', $month);
	    	})->sum('sum');

	    	$sumMonth[$i]['sum'] = (count($sumMonthQuery > 0) ? $sumMonthQuery : 0);
	    endforeach;

	    # sum the point
	    foreach($points as $row):
	    	$i++;
	    	$sumMonthPoint[$i]['point'] = $row->id;
		    $sumMonthPoint[$i]['sum'] = Orders::where('points_id', $row->id)
								      		->whereDate('created_at', '>=', $days30)
								      		->sum('sum');
	    endforeach;

	    # sum 30 days Orders
	    $sum30DaysOrders = Orders::whereBetween('created_at', [$days30, $date])->sum('sum');

	    # sum 30 days Supply
	    $sum30DaysSupply = Supply::whereBetween('created_at', [$days30, $date])->sum('sum');

	    # key performance indicators
	    $sumAllOrders = Orders::sum('sum');
	    $sumAllCosts  = Costs::sum('sum');
	    $sumAllSupply = Supply::sum('sum');

	    $sumAllItemsPrice  = DB::table('stock AS s')
	    						->select('s.price')
	    						->LeftJoin('items AS i', 'i.id', '=', 'items_id')
	    						->sum('i.price');

	    $sumAllItemsQuantity = Stock::sum('items_quantity');

	    $sumAllStock = $sumAllItemsPrice * $sumAllItemsQuantity;
	    $sumAllProfit = $sumAllOrders - $sumAllCosts;

	    $sumAllKey = [
	    	'orders' => $sumAllOrders, 
	    	'costs'  => $sumAllCosts, 
	    	'supply' => $sumAllSupply,
	    	'stock'  => $sumAllStock,
	    	'profit' => $sumAllProfit
	    ];

	    # key performance indicators in point
	    foreach($points as $row):
	    	$i++;
	    	$sumAllPointOrders = Orders::where('points_id', $row->id)->sum('sum');
	    	$sumAllPointCosts = Costs::where('points_id', $row->id)->sum('sum');

	    	$sumAllPointItemsPrice = DB::table('stock AS s')
	    							->select('s.price')
	    							->LeftJoin('items AS i', 'i.id', '=', 'items_id')
	    							->where('points_id', $row->id)
	    							->sum('i.price');

	    	$sumAllPointItemsQuantity = Stock::where('points_id', $row->id)->sum('items_quantity');

	    	$sumAllKeyPoint[$row->point]['orders'] = $sumAllPointOrders;
	    	$sumAllKeyPoint[$row->point]['costs']  = $sumAllPointCosts;
	    	$sumAllKeyPoint[$row->point]['supply'] = Supply::where('points_id', $row->id)->sum('sum');
	    	$sumAllKeyPoint[$row->point]['stock']  = $sumAllPointItemsPrice * $sumAllPointItemsQuantity;
	    	$sumAllKeyPoint[$row->point]['profit'] = $sumAllPointOrders - $sumAllPointCosts;    	
	    endforeach;

	    # week sum 30 days
	    foreach($dateWeek as $row):
		    $i++;
			$sumWeek[$i]['date'] = $row->format('d/m/Y');
			$sum = DB::table('items_orders AS io')
		            ->select(DB::raw("SUM(o.sum) AS sum_week"))
		            ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
		            ->whereDate('o.created_at', '=', $row->format('Y-m-d'))
		            ->groupBy('o.created_at')
		            ->first();

            if(count($sum) > 0)
            {
            	$sumWeek[$i]['sum'] = $sum->sum_week;
            } else {
            	$sumWeek[$i]['sum'] = 0;
            }
	    endforeach;

	    return view('orders.analytics', compact(
	        'sumAll', 'sumMonth', 'sumMonthPoint', 
	        'sumAllKey', 'sumAllKeyPoint',
	        'sum30DaysOrders', 'sum30DaysSupply', 'sumWeek'
	    ));
	}
}
