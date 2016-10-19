<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;

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
        return view('supply.create');
    }

    # get range date
    public function date(Request $request)
    {
    	$supply = Supply::whereBetween('created_at', [$request->date_start, $request->date_end])->get();
    	return view('supply.index', compact('supply'));
    }

    # create
    public function store(Request $request)
    {
        $request['point'] = Auth::user()->point;
        Supply::create($request->all());
        return response()->json(['status' => 1, 'message' => 'Приход товара внесен']);
    }
}
