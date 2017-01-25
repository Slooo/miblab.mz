<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Requests;

use Auth;
use Carbon\Carbon;
use DB;
use Session;
use Validator;

#models
use App\Orders;
use App\Stock;
use App\ItemsOrders;

class OrdersController extends Controller
{
	# list orders
	public function index()
	{
		# manage | all points
		if(Auth::user()->points_id == 0)
		{
			$orders = Orders::orderBy('id', 'desc')->get();
		# admin, cashier | one points
		} else {
			$orders = Orders::where('points_id', Auth::user()->points_id)->orderBy('id', 'desc')->get();
		}

		return view('orders.index', compact('orders'));
	}

	
	# items order
	public function show($id)
	{
		$order = Orders::findOrFail($id);
		return view('orders.items', compact('order', 'id'));
	}

	# cashier page
	public function create()
	{
		$discounts = \App\Discounts::all();
	    return view('orders.create', compact('discounts'));
	}

	# create
	public function store(Request $request)
	{
		$orders = new Orders;
		$items_id = [];

		# 5% is cashier click
		if($request->discount === true && $request->totalSum <= 3000)
		{
			$request['totalSumDiscount'] = $request->totalSum * 5 / 100;
		} else {
			$request['totalSumDiscount'] = $this->get_discount($request->totalSum);
		}

		$order = $orders::create([
			'sum' 		   => $request->totalSum, 
			'sum_discount' => $request->totalSumDiscount, 
			'type' 		   => $request->type, 
			'points_id'	   => Auth::user()->points_id,
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
		                        ->where('o.points_id', Auth::user()->points_id)
		                        ->where('orders_id', $order->id)
		                        ->where('items_id', $id)
		                        ->sum('items_quantity');

		    $stock = Stock::where('items_id', $id)->where('points_id', Auth::user()->points_id)->get();

		    foreach($stock as $row):

			    $old_quantity = $row->items_quantity;
				$quantity = $old_quantity - $new_quantity;

				if($quantity <= 0) {
					Stock::where('items_id', $id)
							->where('points_id', Auth::user()->points_id)
							->delete();
				} else {
					Stock::where('items_id', $id)
							->where('points_id', Auth::user()->points_id)
							->update(['items_quantity' => $quantity]);
				}
		    endforeach;
		}

		return response()->json(['status' => 1, 'message' => $order->id]);
	}

    public function update(Request $request, $id)
    {
		$column = $request->column;
		$value = $request->value;

		switch ($request->type) {
			case 'pivot':
				ItemsOrders::where('id', $id)->update([$column => $value]);
				break;
			case 'main':
				Orders::where('id', $id)->update([$column => $value]);
				break;			

		}

		return response()->json(['status' => 1, 'message' => 'Обновлено']);
    }


    # delete
    public function delete(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:main,pivot',
        ]);

        if ($validator->fails()) {
            $message = $validator->messages();
            $status = 422;
        } else {
            $type = $request->type;

            switch($type)
            {
                case 'main':
                    Orders::destroy($id);

                    $message = 'Удалены все заказы #'.$id;
                    $status = 200;
                break;
                case 'pivot':
                    $orders = ItemsOrders::find($id);
                    $count = ItemsOrders::where('orders_id', $orders->orders_id)->count();

                    if($count == 1)
                    {
                        Orders::destroy($orders->orders);

                        $message = 'Удалены все заказы #'.$orders->orders_id;
                        $status = 301;
                        Session::flash('message', $message);
                    } else {
                        ItemsOrders::destroy($id);
                        $sum = ItemsOrders::where('orders_id', $orders->orders_id)->sum('items_sum');
                        Orders::find($orders->orders_id)->update(['sum' => $sum]);

                        $message = 'Удалено значение #'.$id;
                        $status = 200;
                    }
                break;

            	default:
            	    return false;
            	break;
            }
    	}

    	return response()->json(['message' => $message], $status);
    }
    
	private function get_discount($sum)
	{
		$data = \App\Discounts::all();

		$discount = 0;
		foreach($data as $row)
		{
			if($sum >= $row->sum)
			{
				$discount = $sum * $row->percent / 100;
			}
		}

		$sum_discount = $sum - $discount;
		return $sum_discount;
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
}