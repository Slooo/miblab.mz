<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Requests;

use Auth;
use Carbon\Carbon;
use DB;

#models
use App\Orders;
use App\User;
use App\CCosts;
use App\Costs;
use App\Items;

class OrdersController extends Controller
{
	# list orders
	public function index()
	{
		# manage | all points
		if(Auth::user()->point == 0)
		{
			$orders = Orders::has('pivot')->orderBy('id', 'desc')->get();
		# admin, cashier | one points
		} else {
			$orders = Orders::whereHas('pivot', function ($query) {
			  $query->where('point', Auth::user()->point);
			})->orderBy('id', 'desc')->get();
		}

		return view('orders.index', compact('orders'));
	}

	# items order
	public function show($id)
	{
		$order = Orders::findOrFail($id);
		return view('orders.items', compact('order', 'id'));
	}

	# orders date
	public function date(Request $request)
	{
		$orders = Orders::whereHas('pivot', function($query) use($request)
			{
				$query->whereBetween('created_at', [$request->date_start, $request->date_end]);
			})->get();
		return view('orders.index', compact('orders'));
	}

	# create
	public function store(OrderRequest $request)
	{
		$orders = new Orders;
		$order = $orders::create(['price' => $request->price, 'type' => $request->type]);

		$json = json_decode($request->items, true);

		foreach($json as $row)
		{
			$orders->items()->sync([$row['id'] => ['orders_id' => $order->id, 'point' => Auth::user()->point, 'items_price' => $row['price'], 'items_quantity' => $row['quantity'], 'items_sum' => $row['sum']]]);
		}

		$url = '<strong><a href="'.url('order/'.$order->id).'">Заказ успешно оформлен</a></strong>';
		return response()->json(['status' => 1, 'message' => $url]);
	}

	# manage analytics
	public function analytics()
	{
	    # settings
	    $i = -1; $sumAll = []; $sumMonth = []; $sumMonthPoint = []; $sumWeek = []; $dateWeek = [];

	    $date 	= Carbon::now();
	    $month  = $date->startOfMonth();
	    $days30 = Carbon::today()->subDays(30);

	    $start  = Carbon::today()->subDay(29);
	    for ($i = 0; $i < 30; $i++) {
	        $dateWeek[] = $start->copy();
	        $start->addDay();
	    }

	    # all points
	    $points = User::select('point')->where('point', '!=', 0)->distinct()->get();

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
	    	$sumMonthPoint[$i]['point'] = $row->point;
		    $sumMonthPoint[$i]['sum'] = Orders::whereHas('pivot', function ($query) use($row, $days30) {
		      $query->where('point', $row->point)
		      		->whereDate('created_at', '>=', $days30);
		    })->sum('sum');
	    endforeach;

	    # sum 30 days
	    /*
	    $sum30Days = Orders::whereHas('items', function ($query) use($date) {
	    		$query->whereBetween('items_orders.created_at', [Carbon::today()->subDays(29), $date]);
	    	})->sum('sum');
		*/
	
	    $sum30Days = DB::table('items_orders AS io')
	            ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
	            ->whereBetween('io.created_at', [Carbon::today()->subDays(29), $date])
	            ->sum('o.sum');


	    # week sum 30 days
	    foreach($dateWeek as $row):
		    $i++;
			$sumWeek[$i]['date'] = $row->format('d/m/Y');
			$sum = DB::table('items_orders AS io')
		            ->select(DB::raw("SUM(o.sum) AS sum_week"))
		            ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
		            ->whereDate('io.created_at', '=', $row->format('Y-m-d'))
		            ->groupBy('io.created_at')
		            ->first();

            if(count($sum) > 0)
            {
            	$sumWeek[$i]['sum'] = $sum->sum_week;
            } else {
            	$sumWeek[$i]['sum'] = 0;
            }
	    endforeach;

	    return view('orders.analytics', compact(
	        'sumAll', 'sumMonth', 'sumMonthPoint', 'sum30Days', 'sumWeek'
	        ));
	}
}