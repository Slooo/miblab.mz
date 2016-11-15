<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Requests;

use Auth;
use Carbon\Carbon;
use DB;
use Storage;

#models
use App\Orders;
use App\User;
use App\CCosts;
use App\Costs;
use App\Items;
use App\Supply;
use App\Stock;
use App\ItemsOrders;

class OrdersController extends Controller
{
	# list orders
	public function index()
	{
		# manage | all points
		if(Auth::user()->point == 0)
		{
			$orders = Orders::orderBy('id', 'desc')->get();
		# admin, cashier | one points
		} else {
			$orders = Orders::where('point', Auth::user()->point)->orderBy('id', 'desc')->get();
		}

		return view('orders.index', compact('orders'));
	}

	# cashier page
	public function create()
	{
	    return view('items.cashier');
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
		$dateStart = Carbon::createFromFormat('d/m/Y', $request->dateStart)->addDay(1)->format('Y-m-d');
		$dateEnd = Carbon::createFromFormat('d/m/Y', $request->dateEnd)->addDay(1)->format('Y-m-d');

		$orders = Orders::whereBetween('created_at', [$dateStart, $dateEnd])->orderBy('id', 'desc')->get();

		$data = []; $total = []; $extra = []; $i = 0;

		if(count($orders) > 0)
		{
			foreach($orders as $row):
				$i++;
				$data[$i]['id'] = $row->id;
				$data[$i]['date'] = $row->date_format;
				$data[$i]['sum'] = number_format($row->sum, 0, ' ', ' ');
				$data[$i]['sum_discount'] = number_format($row->sum_discount, 0, ' ', ' ');
				$data[$i]['type'] = ($row->type == 1 ? 'Налично' : 'Безналично');

				$total[$i]['sum'] = $row->sum;
				$total[$i]['sumDiscount'] = $row->sum_discount;
			endforeach;

			$extra['totalSum'] = number_format(array_sum(array_column($total, 'sum')), 0, ' ', ' ');
			$extra['totalSumDiscount'] = number_format(array_sum(array_column($total, 'sumDiscount')), 0, ' ', ' ');
			$status = 1;
		} else {
			$data = 'Нет данных за период';
			$status = 0;
		}

		return response()->json(['status' => $status, 'data' => $data, 'extra' => $extra]);
	}

	// storage/app/settings.json
	private function get_discount($sum)
	{
		$file = Storage::disk('local')->get('settings.json');
		$data = json_decode($file, true);

		$discount = 0;
		foreach($data['discount'] as $row)
		{
			if($sum >= $row['sum'])
			{
				$discount = $sum * $row['percent'] / 100;
			}
		}

		$sum_discount = $sum - $discount;
		return $sum_discount;
	}

	# create
	public function store(Request $request)
	{
		$orders = new Orders;

		$items_id = [];

		// get discount
		$sum_discount = $this->get_discount($request->totalSum);

		$order = $orders::create([
			'sum' 		   => $request->totalSum, 
			'sum_discount' => $sum_discount, 
			'type' 		   => $request->type, 
			'point'		   => Auth::user()->point,
			'created_at'   => Carbon::now(),
		]);

		$json = json_decode($request->items, true);

		foreach($json as $row)
		{
			$orders->items()->sync([
				$row['id'] => [
					'orders_id' 	 => $order->id, 
					'items_price' 	 => $row['price'], 
					'items_quantity' => $row['quantity'], 
					'items_sum' 	 => $row['sum']
				]
			]);

			$items_id[$row['id']] = $row['id'];
		}

		// remove qty stock
		foreach($items_id as $id)
		{
		    $new_quantity = ItemsOrders::LeftJoin('orders AS o', 'o.id', '=', 'orders_id')
		                        ->where('o.point', Auth::user()->point)
		                        ->where('orders_id', $order->id)
		                        ->where('items_id', $id)
		                        ->sum('items_quantity');

		    $stock = Stock::where('items_id', $id)->where('point', Auth::user()->point)->get();

		    foreach($stock as $row):

			    $old_quantity = $row->items_quantity;
				$quantity = $old_quantity - $new_quantity;

				if($quantity <= 0) {
					Stock::where('items_id', $id)
							->where('point', Auth::user()->point)
							->delete();
				} else {
					Stock::where('items_id', $id)
							->where('point', Auth::user()->point)
							->update(['items_quantity' => $quantity]);
				}
		    endforeach;
		}

		return response()->json(['status' => 1, 'message' => $order->id]);
	}

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
		    $sumMonthPoint[$i]['sum'] = Orders::where('point', $row->point)
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
	    	$sumAllPointOrders = Orders::where('point', $row->point)->sum('sum');
	    	$sumAllPointCosts = Costs::where('point', $row->point)->sum('sum');

	    	$sumAllPointItemsPrice = DB::table('stock AS s')
	    							->select('s.price')
	    							->LeftJoin('items AS i', 'i.id', '=', 'items_id')
	    							->where('point', $row->point)
	    							->sum('i.price');

	    	$sumAllPointItemsQuantity = Stock::where('point', $row->point)->sum('items_quantity');

	    	$sumAllKeyPoint[$row->point]['orders'] = $sumAllPointOrders;
	    	$sumAllKeyPoint[$row->point]['costs']  = $sumAllPointCosts;
	    	$sumAllKeyPoint[$row->point]['supply'] = Supply::where('point', $row->point)->sum('sum');
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