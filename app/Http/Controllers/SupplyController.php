<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use Carbon\Carbon;
use Validator;
use Session;

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
        $supply = Supply::where('points_id', Auth::user()->points_id)->orderBy('id', 'desc')->get();
        return view('supply.index', compact('supply'));
    }

    # create page
    public function create()
    {
        $counterparty = Counterparty::all();
        return view('orders.create', compact('counterparty'));
    }

    # create
    public function store(Request $request)
    {
        $model = new Supply;

        $items_id = [];

        $supply = $model::create([
            'sum'             => $request->sum, 
            'type'            => $request->type,
            'counterparty_id' => $request->counterparty,
            'points_id'       => Auth::user()->points_id,
            'created_at'      => Carbon::now(),
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
                                ->where('s.points_id', Auth::user()->points_id)
                                ->where('supply_id', $supply->id)
                                ->where('items_id', $id)
                                ->sum('items_quantity');

            $stock = Stock::where('items_id', $id)->where('points_id', Auth::user()->points_id)->get();

            if(count($stock) > 0)
            {
                foreach($stock as $row):

                    $old_quantity = $row->items_quantity;
                    $quantity = $old_quantity + $new_quantity;

                    Stock::where('items_id', $id)
                            ->where('points_id', Auth::user()->points_id)
                            ->update(['items_quantity' => $quantity]);
                endforeach;
            } else {
                Stock::create([
                    'items_id' => $id,
                    'items_quantity' => $new_quantity,
                    'points_id' => Auth::user()->points_id
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
        $column = $request->column;
        $value = $request->value;

        switch($request->column)
        {
            case 'items_price':
                $check = 'required|numeric';
            break;

            case 'items_quantity':
                $check = 'required|numeric';
            break;

            default:
                return false;
            break;
        }

        $validator = Validator::make($request->all(), [
            'value' => $check
        ]);

        if ($validator->fails()) {
            $data = [];
            $message = $validator->messages();
            $status = 422;
        } else {
            $column = $request->column;
            $value = $request->value;

            $supply = ItemsSupply::find($id);
            $supply->$column = $value;
            $supply->items_sum = $supply->items_price * $supply->items_quantity;
            $supply->save();

            $sum = ItemsSupply::where('supply_id', $supply->supply_id)->sum('items_sum');
            Supply::find($supply->supply_id)->update(['sum' => $sum]);

            $message = 'Обновлено';
            $status = 200;
        }

        return response()->json(['message' => $message, 'data' => ['id' => $id, 'sum' => $supply->items_sum], $status]);
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
                    Supply::destroy($id);

                    $message = 'Удалены все приходы #'.$id;
                    $status = 200;
                break;
                case 'pivot':
                    $supply = ItemsSupply::find($id);
                    $count = ItemsSupply::where('supply_id', $supply->supply_id)->count();

                    if($count == 1)
                    {
                        Supply::destroy($supply->supply_id);

                        $message = 'Удалены все приходы #'.$supply->supply_id;
                        $status = 301;
                        Session::flash('message', $message);
                    } else {
                        ItemsSupply::destroy($id);
                        $sum = ItemsSupply::where('supply_id', $supply->supply_id)->sum('items_sum');
                        Supply::find($supply->supply_id)->update(['sum' => $sum]);

                        $message = 'Удалено значение #'.$id;
                        $status = 200;
                    }
                break;
            }
        }

        return response()->json(['message' => $message], $status);
    }

    # get range date
    public function date(Request $request)
    {
        $data = []; $total = []; $extra = []; $i = 0;

        $dateStart = Carbon::createFromFormat('d/m/Y', $request->date_start)->addDay(1)->format('Y-m-d');
        $dateEnd = Carbon::createFromFormat('d/m/Y', $request->date_end)->addDay(1)->format('Y-m-d');

        $supply = Supply::whereBetween('created_at', [$dateStart, $dateEnd])->orderBy('id', 'desc')->get();

        if(count($supply) > 0)
        {
            foreach($supply as $row):
                $i++;
                $data[$i]['id'] = $row->id;
                $data[$i]['date'] = $row->date_format;
                $data[$i]['sum'] = number_format($row->sum, 0, ' ', ' ');
                $data[$i]['type'] = ($row->type == 1 ? 'Налично' : 'Безналично');

                $total[$i]['sum'] = $row->sum;
            endforeach;

            $extra['totalSum'] = number_format(array_sum(array_column($total, 'sum')), 0, ' ', ' ');
            $status = 1;
        } else {
            $data = 'Нет данных за период';
            $status = 0;
        }

        return response()->json(['status' => $status, 'data' => $data, 'extra' => $extra]);
    }
}
