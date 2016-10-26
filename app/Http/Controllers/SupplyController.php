<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use Carbon\Carbon;

# models
use App\Supply;

class SupplyController extends Controller
{
	# index page
    public function index()
    {
    	$supply = Supply::whereHas('pivot', function($query){
            $query->where('point', Auth::user()->point);
        })->get();

    	return view('supply.index', compact('supply'));
    }

    # create page
    public function create()
    {
        return view('items.cashier');
    }

    # create
    public function store(Request $request)
    {
        # изменять количество у товара
        $model = new Supply;
        $supply = $model::create(['sum' => $request->sum, 'sum_discount' => $request->sum, 'type' => $request->type]);
        $json = json_decode($request->items, true);

        foreach($json as $row)
        {
            $model->items()->sync([$row['id'] => ['supply_id' => $supply->id, 'point' => Auth::user()->point, 'items_price' => $row['price'], 'items_quantity' => $row['quantity'], 'items_sum' => $row['sum']]]);
        }

        $url = '<strong><a href="'.url('admin/supply/'.$supply->id).'">Приход товаров внесен</a></strong>';
        return response()->json(['status' => 1, 'message' => $url]);
    }

    # get one supply
    public function show($id)
    {
        $supply = Supply::findOrFail($id);
        return view('supply.items', compact('supply', 'id'));
    }

    # get range date
    public function date(Request $request)
    {
    	$supply = Supply::whereBetween('created_at', [$request->date_start, $request->date_end])->get();
    	return view('supply.index', compact('supply'));
    }

}
