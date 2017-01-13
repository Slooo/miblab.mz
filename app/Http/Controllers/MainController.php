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
use App\ItemsSupply;

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

	    return view('analytics.index', compact(
	        'sumAll', 'sumMonth', 'sumMonthPoint', 
	        'sumAllKey', 'sumAllKeyPoint',
	        'sum30DaysOrders', 'sum30DaysSupply', 'sumWeek'
	    ));
	}

	public function getMonth($month)
	{
		// sub month сделаю заготовку запроса
		$items = DB::table('items_supply AS is')
							->select('is.items_price', 'is.items_id')
							->LeftJoin('supply AS s', 's.id', '=', 'is.supply_id')
							->whereMonth('s.created_at', '=', $month)
							->groupBy('is.items_id')
							->get();
		return $items;
	}

	public function xyz()
	{
		// массив месяцев с данными
		$start = Carbon::now()->subMonths(6); // с текущей даты - 6 месяцев
		for ($i = 0; $i < 7; $i++) {
			$supply[$i] = DB::table('items_supply AS is')
							->select('is.items_price', 'is.items_id')
							->LeftJoin('supply AS s', 's.id', '=', 'is.supply_id')
							->whereMonth('s.created_at', '=', $start->month)
							->groupBy('is.items_id')
							->get();
		    $start->addMonth();
		}

		// добавить один и тот же товар в несколько месяцевв. от 4-6

		$months = [0 => 'Январь', 1 => 'Февраль', 2 => 'Март', 3 => 'Апрель', 4 => 'Май', 5 => 'Июнь',
		6 => 'Июль', 7 => 'Август', 8 => 'Сентябрь', 9 => 'Октябрь', 10 => 'Ноябрь', 11 => 'Декабрь'];

		$months_xyz = [];
		foreach($supply as $key => $keys)
		{
			foreach($months as $m => $month)
			{
				if($key == $m)
				{
					$months_xyz[$key] = $month;
				}
			}
		}

		$items = Items::all();

		/* 
			здесь получаем все товары в каждом месяце ( где не пусто )
			где ключ массива = месяц
		*/

		foreach($supply as $key => $keys)
		{
			foreach($items as $item)
			{
				foreach($keys as $k => $row):
					if($row->items_id == $item->id)
					{
						foreach($months as $month => $m)
						{
							if($month == $key)
							{
								$items_month['items'][$item->id][$key]['items_sum'] = $item->price - $row->items_price;
								$items_month['items'][$item->id][$key]['items_id'] = $item->id;
								$items_month['items'][$item->id][$key]['items_name'] = $item->name;
								$months_list[$key] = $m;
							}
						}
					}
				endforeach;
			}
		}

		#dd($items_month);

		foreach($supply as $key => $keys)
		{
			foreach($items as $item)
			{
				foreach($keys as $k => $row):
					if($row->items_id == $item->id)
					{
						foreach($months as $month => $m)
						{
							if($month == $key)
							{
								$new[$key][$item->id]['items_sum'] = $item->price - $row->items_price;
								$new[$key][$item->id]['items_id'] = $item->id;
								$new[$key][$item->id]['items_name'] = $item->name;
								$new[$key][$item->id]['month'] = $m;
							}
						}
					}
				endforeach;
			}
		}


		// делаем из items_id ключи и в значения сумму
		$result = [];
		foreach($new as $k => $v) {
			foreach($v as $n):
				$result[$n['items_id']][$k] = $n['items_sum'];
		    endforeach;
		}

		// получаем среднее значение для каждого товара
		$middle_sum = []; $i = 0;
		foreach($result as $key => $value) {
		    $middle_sum[] = ['items_id' => $key, 'sum' => array_sum($value), 'count' => count($value)];
		}
	
		// среднее значение
		$middle = [];
		foreach($middle_sum as $row)
		{
			$middle[$row['items_id']] = $row['sum'] - $row['count'];
		}

		// Вычисляем из каждой продажи каждого товара в каждом месяце и возводим в квадрат
		foreach($new as $month => $array)
		{
			foreach($array as $key => $item)
			{
				foreach($middle as $id => $sum)
				{
					if($item['items_id'] == $id)
					{
						$new[$month][$key]['square'] = pow($item['items_sum'] - $sum, 2);
						$new[$month][$key]['sum_square'] = 0;
					}
				}
			}
		}

		// складываем возведенные в квадрат суммы всех товаров за месяц
		$result = [];
		foreach($new as $k => $v) {
			foreach($v as $n):
				$result[$n['items_id']][$k]['square'] = $n['square'];
				$result[$n['items_id']][$k]['sum_square'] = 0;
		    endforeach;
		}
	
		// сложить сумма square
		foreach($result as $id => $item)
		{
			$sum_square[$id] = array_sum(array_column($item, 'square'));
		}

		foreach($sum_square as $id => $square)
		{
			foreach($middle_sum as $sum)
			{
				foreach($new as $item)
				{
					foreach($item as $val):
						if($id == $sum['items_id'] && $sum['count'] - 1 > 0 && $id == $val['items_id'])
						{
							$items_month['items'][$id]['xyz'] = round(((sqrt($square / ($sum['count'] - 1))) / $row['sum']) * 100, 0);

							if($items_month['items'][$id]['xyz'] < 10)
							{
								$items_month['items'][$id]['group'] = 'X';
							} 

							else 

							if($items_month['items'][$id]['xyz'] > 10 && $items_month['items'][$id]['xyz'] < 25)
							{
								$items_month['items'][$id]['group'] = 'Y';
							} 

							else

							if($items_month['items'][$id]['xyz'] > 25)
							{
								$items_month['items'][$id]['group'] = 'Z';
							}
						}
					endforeach;
				}
			}
		}

		// убрать month, items_id, items_Name перенести в общий.

		$items_month = array_merge($items_month, ['months' => $months_list]);

		return view('analytics.xyz', compact('items_month'));

	/*
		//$items = [15, 30, 27, 45, 80, 12];

		// количество
		$count = count($items);

		// средняя сумма значений 2
		$sum = array_sum($items)/$count;

		// Вычесть среднее из каждого из значений и возводим в квадрат
		foreach($items as &$val):
			$val = pow($val - $sum, 2);
		endforeach;

		// складываем возведенные в квадрат суммы
		$sum_square = array_sum($items); # FFFFFFFFF

		// дисперсия
		$dispersion = $sum_square / ($count - 1);

		// стандартное отклонение
		$stand_otklonenie = sqrt($dispersion);

		// zyx analytic
		$koef_varicii = $stand_otklonenie / $sum;
		
		// convert percent
		$koef_varicii = round($koef_varicii * 100, 0);

		if($koef_varicii > 20)
		{
			dd('x');
		} else {
			dd('no');
		}

		//dd($xyz);

		//echo round(1241757, -3); // 1242000

		return view('analytics.xyz', compact('items', 'xyz'));
		*/
	}

	public function abc()
	{
		// settings
		$abc = []; $i = 0;

		$supply = ItemsSupply::all();
		$items = Items::all();

		/*
		$get = DB::table('items_orders AS io')
				->select(DB::raw("sum(items_sum) as items_sum, items_id"))
				->groupBy('items_id')
				->get();
		*/

		foreach($supply as $row){
			foreach($items as $item)
			{
				if($row->items_id == $item->id)
				{
					$get[$i]['items_sum'] = $item->price - $row->items_price;
					$get[$i]['items_id'] = $item->id;
				}
			}
			$i++;
		}

		// суммируем по items_id
		$result = [];
		foreach($get as $k => $v) {
		    $id = $v['items_id'];
		    $result[$id][] = $v['items_sum'];
		}

		$get = [];
		foreach($result as $key => $value) {
		    $get[] = ['items_id' => $key, 'items_sum' => array_sum($value)];
		}

		$i = 0;
		$sum = ItemsOrders::sum('items_sum');

		foreach($get as $row):
			$abc[$i]['share'] = ceil(($row['items_sum'] / $sum) * 100); # доля
			$abc[$i]['share_storage'] = ceil(($row['items_sum'] / $sum) * 100); # доля для накопительных
			$abc[$i]['items_id'] = $row['items_id'];
			$abc[$i]['profit'] = $row['items_sum'];
			$abc[$i]['name'] = Items::find($row['items_id'])->name;
			$i++;
		endforeach;

		// сортируем по убыванию значений
		uasort($abc, function($a, $b) {
		    return $a['profit'] < $b['profit'];
		});

		// новый массив с обновленными ключами
		$abc = array_values($abc);

		// количество
		$count = count($abc);

		// доля накопительных значений
		foreach($abc as $key => $row):
			if($key > 0 && $key < $count)
			{
				$abc[$key]['share_storage'] = $abc[$key-1]['share_storage'] + $abc[$key]['share_storage'];
			}

			if($key == 0)
			{
				$abc[0]['share_storage'] = $abc[0]['share_storage'];
			}
		endforeach;

		// создаем группы
		foreach($abc as $key => $row)
		{
			if($row['share_storage'] > 0 && $row['share_storage'] <= 80)
			{
				$abc[$key]['group'] = 'A';
			}

			else

			if($row['share_storage'] >= 80 && $row['share_storage'] <= 95)
			{
				$abc[$key]['group'] = 'B';
			}
			
			else

			if($row['share_storage'] > 95)
			{
				$abc[$key]['group'] = 'C';
			}
		}

		return view('analytics.abc', compact('abc'));
	}
}
