<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\CCosts;
use App\Costs;
use App\User;
use App\Orders;
use Auth;
use Carbon\Carbon;
use DB;

class CostsController extends Controller
{
    # analytics
    public function analytics()
    {
        # settings
        $sum_week = []; $date_week = [];

        $date = Carbon::now();
        $month = $date->startOfMonth();
        $days30 = Carbon::today()->subDays(30)->toDateString();

        $start = Carbon::today()->subDay(29);
        for ($i = 0; $i < 30; $i++) {
            $date_week[] = $start->copy();
            $start->addDay();
        }

        # sum 30 days
        $sum = DB::table('items_orders AS io')
                ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
                ->whereBetween('io.created_at', [Carbon::today()->subDays(29), $date])
                ->sum('o.sum');

        # week sum 30 days
        foreach($date_week as $row):
        $sum_week[] = DB::table('items_orders AS io')
                ->select(DB::raw("SUM(o.sum) AS sum_week"))
                ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
                ->whereDate('io.created_at', '=', $row->format('Y-m-d'))
                ->groupBy('io.created_at')
                ->first();
        endforeach;

        $ccosts = CCosts::all();
        $points = User::select('point')->distinct()->where('point', '!=', 0)->get();
        return view('costs.analytics', compact(
            'ccosts', 'order', 'points', 'month', 'date', 'days30', 'date_week', 'sum_week', 'sum'
            ));
    }
    
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
