<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ItemsRequest;
use App\Http\Requests;

use Auth;
use Carbon\Carbon;
use DNS1D;

# models
use App\Items;

class ItemsController extends Controller
{
    # all items
    public function index()
    {
        $items = Items::orderBy('id', 'desc')->get();
        return view('items.items', compact('items'));
    }

    # search item barcode
    public function search(ItemsRequest $request)
    {
        # this admin
        #if(Auth::user()->status == 1)
        #{
         #   $items = Items::where('barcode', $request->barcode)->first();
        # this cashier
        #} else {
            $items = Items::where('barcode', $request->barcode)->where('status', 1)->get();
        #}

        if (count($items) > 0)
        {
            return response()->json(['status' => 1, 'message' => 'Товар найден', 'items' => $items]);            
        } else {
            return response()->json(['status' => 0, 'message' => 'Товар не найден']);       
        }
   	}
    
    # send the barcode admin (new item)
    public function barcode(Request $request)
    {
        $item = Items::get()->where('barcode', $request->barcode);        
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

    # update page
    public function edit($id)
    {
        $item = Items::findOrFail($id);
        return view('items.edit', compact('item'));
    }

    # update
    public function update($id, Request $request)
    {
        $item = Items::findOrFail($id);
        $item->update($request->all());
        return response()->json(['status' => 1, 'message' => 'Товар обновлен']);
    }

    # create page
    public function create()
    {
        return view('items.create');
    }

    # create
    public function store(ItemsRequest $request)
    {
        $request['point'] = Auth::user()->point;
        Items::create($request->all());
        return response()->json(['status' => 1, 'message' => 'Товар создан']);
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