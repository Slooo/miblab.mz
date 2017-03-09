<?php
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

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
        $data = [];
        $item = Items::where('barcode', $request->barcode)->where('status', 1)->first();
        if(count($item) > 0)
        {
            $stock = Stock::select('items_quantity')->where('items_id', $item->id)->first();
            if(count($stock) > 0)
            {
                $status = 200;
                $message = 'Товар найден';
                $data = $item;
                $data['stock'] = $stock->items_quantity;
            } else {
                $status = 422;
                $message = 'Товар отсутствует на складе';
            }

            // check barcode dublicate
            if($request->items)
            {
                $json = json_decode($request->items);
                foreach ($json->items as $value) 
                {
                    if($value->id == $item->id)
                    {
                        $status = 201;
                        $message = 'Товар уже есть в списке';
                        $data = $value->item;
                    }
                }
            }

        } else {
            $status = 422;
            $message = 'Товар не найден '.$item;
        }

        return response()->json(['data' => $data, 'message' => $message], $status);      
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
        switch($request->column)
        {
            case 'price':
                $check = 'required|numeric';
            break;

            default:
                return false;
            break;
        }

        $validator = Validator::make($request->all(), [
            'value' => $check,
        ]);

        if ($validator->fails()) {
            $message = $validator->messages();
            $status = 422;
        } else {
            $column = $request->column;
            $value = $request->value;

            $item = Items::findOrFail($id);
            $item->$column = $value;
            $item->save();

            $message = 'Обновлено';
            $status = 200;
        }

        return response()->json(['message' => $message], $status);
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
        // проверка существования штрихкода
        $barcode = DNS1D::getBarcodeSVG($request->barcode, "EAN13");
        $item = Items::where('barcode', $request->barcode)->first();
        $time = Carbon::now()->format('d.m.Y');
        return response()->json(['status' => 200, 'barcode' => $barcode, 'item' => $item, 'time' => $time]);
    }

}