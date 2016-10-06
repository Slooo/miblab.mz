<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Requests;
use App\Orders;
use Auth;

class OrderController extends Controller
{
	# all orders
	public function index()
	{
		$orders = Orders::orderBy('id', 'desc')->get();#->take(10)->get();
		if(count($orders) > 0)
		{
			return view('order.index')->with(['orders' => $orders]);
		} else {
			abort(404);
		}
	}

	# items order
	public function show($id)
	{
		$order = Orders::findOrFail($id);
		return view('order.items', compact('order', 'id'));
	}

	# create
	public function store(OrderRequest $request)
	{
		$orders = new Orders;
		$order = $orders::create(['price' => $request->price, 'type' => $request->type]);

		$json = json_decode($request->items, true);

		foreach($json as $row)
		{
			$orders->items()->sync([$row['id'] => ['orders_id' => $order->id, 'points_id' => Auth::user()->point, 'items_price' => $row['price'], 'items_quantity' => $row['quantity'], 'items_sum' => $row['sum']]]);
		}

		$url = '<strong><a href="'.url('order/'.$order->id).'">Заказ успешно оформлен</a></strong>';
		return response()->json(['status' => 1, 'message' => $url]);
	}
}