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
        #

        $data = [];
        $item = Items::where('barcode', $request->barcode)->where('status', 1)->first();

        if($request->segment == 'orders')
        {
            if(count($item) > 0)
            {
                $stock = Stock::select('items_quantity')->where('items_id', $item->id)->first();
                if(count($stock) > 0)
                {
                    $status = 200;
                    $data = $item;
                    $data['stock'] = $stock->items_quantity;
                } else {
                    $status = 422;
                }
            } else {
                $status = 422;
            }
        } else {
            $status = 200;
            $data = $item;
            $data['stock'] = 999;
        }

        return response()->json(['data' => $data], $status);      
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
            return response()->json(['message' => 'Штрихкод отправлен'], 200);
        }
    }

    # update status
    public function status(Request $request)
    {
        $item = Items::findOrFail($request->id);
        $status = ($request->status == 0 ? 1 : 0);
        $item->update(['status' => $status]);
        return response()->json(['data' => $status], 200);
    }

    # create
    public function store(ItemsRequest $request)
    {
        $data = Items::create($request->all());
        return response()->json(['message' => 'Товар создан', 'data' => $data], 200);
    }

    # update
    public function update($id, Request $request)
    {
        switch($request->column)
        {
            case 'price':
                $check = 'required|numeric';
            break;

            case 'name':
                $check = 'required';
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
                    Items::destroy($id);
                    $message = 'Удален товар #'.$id;
                    $status = 200;
                break;
                case 'pivot':
                    return false;
                break;

                default:
                    return false;
                break;
            }
        }

        return response()->json(['message' => $message], $status);
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