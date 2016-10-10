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
    	$ccosts = CCosts::find($id);
    	return view('costs.costs', compact('ccosts'));
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
    	$costs->ccosts()->sync([$request->ccosts_id => ['costs_id' => $row->id, 'points_id' => Auth::user()->point]]);

        $url = '<strong><a href="'.url('costs/'.$request->ccosts_id).'">Расходы внесены</a></strong>';
    	return response()->json(['status' => 1, 'message' => $url]);            
    }
}
