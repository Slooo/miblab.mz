<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use Carbon\Carbon;

# models
use App\Supply;
use App\ItemsSupply;
use App\Stock;
use App\Counterparty;

class SupplyController extends Controller
{
    # index page
    public function index()
    {
        $supply = Supply::where('point', Auth::user()->point)->orderBy('id', 'desc')->get();
        return view('supply.index', compact('supply'));
    }

    # create page
    public function create()
    {
        $counterparty = Counterparty::all();
        return view('items.cashier', compact('counterparty'));
    }

    # create
    public function store(Request $request)
    {
        $model = new Supply;

        $items_id = [];

        $supply = $model::create([
            'sum'          => $request->sum, 
            'sum_discount' => $request->sum, 
            'type'         => $request->type,
            'counterparty_id' => $request->counterparty,
            'point'        => Auth::user()->point,
            'created_at'   => Carbon::now(),
        ]);

        $json = json_decode($request->items, true);

        foreach($json as $key => $row)
        {
            $model->items()->sync([
                $row['id'] => [
                    'supply_id' => $supply->id, 
                    'items_price' => $row['price'], 
                    'items_quantity' => $row['quantity'], 
                    'items_sum' => $row['sum']
                ]
            ]);

            $items_id[$row['id']] = $row['id']; 
        }

        // add stock
        foreach($items_id as $id)
        {
            $new_quantity = ItemsSupply::LeftJoin('supply AS s', 's.id', '=', 'supply_id')
                                ->where('s.point', Auth::user()->point)
                                ->where('supply_id', $supply->id)
                                ->where('items_id', $id)
                                ->sum('items_quantity');

            $stock = Stock::where('items_id', $id)->where('point', Auth::user()->point)->get();

            if(count($stock) > 0)
            {
                foreach($stock as $row):

                    $old_quantity = $row->items_quantity;
                    $quantity = $old_quantity + $new_quantity;

                    Stock::where('items_id', $id)
                            ->where('point', Auth::user()->point)
                            ->update(['items_quantity' => $quantity]);
                endforeach;
            } else {
                Stock::create([
                    'items_id' => $id,
                    'items_quantity' => $new_quantity,
                    'point' => Auth::user()->point
                ]);
            }
        }

        return response()->json(['status' => 1, 'message' => $supply->id]);
    }

    # get one supply
    public function show($id)
    {
        $supply = Supply::findOrFail($id);
        return view('supply.items', compact('supply', 'id'));
    }

    # update
    public function update(Request $request, $id)
    {
        $col = $request->col;
        $val = $request->val;
        $data = [];

        $itemsSupply = ItemsSupply::find($request->id);
        $itemsSupply->$col = $val;
        $sum = $itemsSupply->items_sum = $itemsSupply->items_price * $itemsSupply->items_quantity;
        $itemsSupply->save();

        $supply = Supply::find($id);
        $totalSum = $supply->items()->sum('items_sum');
        $supply->sum = $totalSum;
        $supply->sum_discount = $totalSum;
        $supply->save();

        $data['value'] = number_format($val, 0, ' ', ' ');
        $data['sum'] = number_format($sum, 0, ' ', ' ');
        $data['totalSum'] = number_format($totalSum, 0, ' ', ' ');
        $data['totalSumDiscount'] = number_format($totalSum, 0, ' ', ' ');

        return response()->json(['status' => 1, 'message' => 'Обновлено', 'data' => $data]);
    }

    # delete
    public function destroy(Request $request, $id)
    {
        $supply = Supply::find($id);

        $type = $request->type;
        $id_pivot = $request->id;

        $data = [];

        switch ($request['type']) {
            case 'main':
                $supply->delete();
                $supply->items()->detach();
                $status = 'redirect';
            break;
            case 'pivot':
                $count = ItemsSupply::where('supply_id', $id)->count();

                if($count == 1)
                {
                    ItemsSupply::find($id_pivot)->delete();
                    $supply->delete();
                    $status = 'redirect';
                } else {
                    ItemsSupply::find($id_pivot)->delete();
                    $totalSum = $supply->items()->sum('items_sum');
                    $supply->sum = $totalSum;
                    $supply->sum_discount = $totalSum;
                    $supply->save();

                    $data['totalSum'] = number_format($totalSum, 0, ' ', ' ');
                    $data['totalSumDiscount'] = number_format($totalSum, 0, ' ', ' ');
                    $status = 1;
                }
                #$supply->items()->detach($id_pivot);
            break;
        }

        return response()->json(['status' => $status, 'message' => 'Удалено', 'data' => $data]);
    }

    # get range date
    public function date(Request $request)
    {

        $data = []; $total = []; $extra = []; $i = 0;

        $dateStart = Carbon::createFromFormat('d/m/Y', $request->dateStart)->addDay(1)->format('Y-m-d');
        $dateEnd = Carbon::createFromFormat('d/m/Y', $request->dateEnd)->addDay(1)->format('Y-m-d');

        $supply = Supply::whereBetween('created_at', [$dateStart, $dateEnd])->orderBy('id', 'desc')->get();

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
