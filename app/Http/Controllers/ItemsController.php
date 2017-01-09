<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ItemsRequest;
use App\Http\Requests;

use Validator;
use Auth;
use Carbon\Carbon;
use DNS1D;

# models
use App\Items;
use App\Stock;

class ItemsController extends Controller
{
    # all items
    public function index()
    {
        $items = Items::orderBy('id', 'desc')->get();
        return view('items.items', compact('items'));
    }

    # search item barcode
    public function search(Request $request)
    {
        # this admin
        #if(Auth::user()->status == 1)
        #{
         #   $items = Items::where('barcode', $request->barcode)->first();
        # this cashier
        #} else {
        #}

        $item = Items::where('barcode', $request->barcode)->where('status', 1)->first();

        if(count($item) > 0)
        {
            $stock = Stock::select('items_quantity')->where('items_id', $item->id)->first();
            if(count($stock) > 0)
            {
                $status = 1;
                $message = 'Товар найден';
                $data = $item;
                $data['stock'] = $stock->items_quantity;
            } else {
                $status = 0;
                $message = 'Товар отсутствует на складе';
                $data = [];
            }

            // check barcode dublicate
            if($request->items)
            {
                $json = json_decode($request->items);
                foreach ($json->items as $value) 
                {
                    if($value->id == $item->id)
                    {
                        $status = 0;
                        $message = 'Товар уже есть в списке';
                        $data = $value->item;
                    }
                }
            }

        } else {
            $status = 2;
            $message = 'Товар не найден';
        }

        // после orders create очистить сессию
        return response()->json(['status' => $status, 'message' => $message, 'data' => $data]);
   	}

    # get max quantity
    public function stock_quantity(Request $request)
    {
        $quantity = Stock::select('items_quantity')->where('items_id', $request->id)->first();
        return response()->json(['status' => 1, 'quantity' => $quantity]);
    }
    
    # send the barcode admin (new item)
    public function barcode(Request $request)
    {
        $item = Items::get()->where('barcode', $request->barcode);
        //if no item or create laravel basic function    
        if(count($item) > 0)
        {
            return response()->json(['status' => 0, 'message' => 'Штрихкод существует']);
        } else {
            Items::create(['barcode' => $request->barcode, 'status' => 0]);
            return response()->json(['status' => 1, 'message' => 'Штрихкод отправлен']);
        }
    }

    # update status
    public function status(Request $request)
    {
        $item = Items::findOrFail($request->id);
        $status = ($request->status == 0 ? 1 : 0);
        $item->update(['status' => $status]);
        return response()->json(['status' => $status]);
    }

    # update
    public function update($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            $status = 0;
            $message = $validator->messages();
            $data = [];
        } else {
            $column = $request->column;
            $value = $request->value;

            $item = Items::findOrFail($id);
            $item->$column = $value;
            $item->save();

            $status = 1;
            $message = 'Обновлено';
            $data['value'] = number_format($value, 0, ' ', ' ');            
        }

        return response()->json(['status' => $status, 'message' => $message, 'data' => $data]);
    }

    # create page !
    public function create()
    {
        return view('items.create');
    }

    # create
    public function store(ItemsRequest $request)
    {
        $data = Items::create($request->all());
        return response()->json(['status' => 1, 'message' => 'Создано', 'data' => $data]);
    }

    # generate barcode
    public function barcode_generate(Request $request)
    {
        $barcode = DNS1D::getBarcodeSVG($request->barcode, "EAN13");
        $item = Items::where('barcode', $request->barcode)->first();
        $time = Carbon::now()->format('d.m.Y');
        return response()->json(['status' => 1, 'barcode' => $barcode, 'item' => $item, 'time' => $time]);
    }

}