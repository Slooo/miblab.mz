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
    	$supply = Supply::where('point', Auth::user()->point)->get();
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
        $supply = $model::create(['sum' => $request->sum, 'sum_discount' => $request->sum, 'type' => $request->type, 'point' => Auth::user()->point]);
        $json = json_decode($request->items, true);

        foreach($json as $row)
        {
            $model->items()->sync([$row['id'] => ['supply_id' => $supply->id, 'items_price' => $row['price'], 'items_quantity' => $row['quantity'], 'items_sum' => $row['sum']]]);
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
        $dateStart = Carbon::createFromFormat('d/m/Y', $request->dateStart)->addDay(1)->format('Y-m-d');
        $dateEnd = Carbon::createFromFormat('d/m/Y', $request->dateEnd)->addDay(1)->format('Y-m-d');

    	$supply = Supply::whereBetween('created_at', [$dateStart, $dateEnd])->orderBy('id', 'desc')->get();

        $data = []; $total = []; $extra = []; $i = 0;

        if(count($supply) > 0)
        {
            foreach($supply as $row):
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
