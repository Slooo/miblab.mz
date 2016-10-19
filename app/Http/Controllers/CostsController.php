<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\CCosts;
use App\Costs;
use Auth;
use DB;

class CostsController extends Controller
{
    # categories costs
    public function index()
    {
        $ccosts = CCosts::all();
    	return view('costs.categories', compact('ccosts'));
    }

    # category costs
    public function show($id)
    {
        $ccosts = CCosts::find($id)->name;

        # manage | all points
        if(Auth::user()->point == 0)
        {
            $costs = Costs::whereHas('pivot', function($query) use($id){
                $query->where('ccosts_id', $id);
            })->get();
        # admin, cashier | one points
        } else {
            $costs = Costs::whereHas('pivot', function($query) use($id){
                $query->where('ccosts_id', $id)
                      ->where('point', Auth::user()->point);
            })->get();
        }

    	return view('costs.costs', compact('ccosts', 'costs'));
    }

    # costs range date
    public function date(Request $request)
    {
        $ccosts = CCosts::find($request->id)->name;
        $costs = Costs::whereHas('pivot', function($query) use($request)
            {
                $query->where('ccosts_id', $request->id)
                      ->whereBetween('date', [$request->date_start, $request->date_end]);
            })->get();

        return view('costs.costs', compact('ccosts', 'costs'));
    }

    # create page
    public function create()
    {
    	$ccosts = CCosts::lists('name', 'id');
    	return view('costs.create', compact('ccosts'));
    }

    # create
    public function store(Request $request)
    {
    	$costs = new Costs;
    	$row = $costs::create($request->all());
    	$costs->ccosts()
        ->sync([$request->ccosts_id => ['costs_id' => $row->id, 'point' => Auth::user()->point]]);

        $url = '<strong><a href="'.url('costs/'.$request->ccosts_id).'">Расходы внесены</a></strong>';
    	return response()->json(['status' => 1, 'message' => $url]);            
    }
}
