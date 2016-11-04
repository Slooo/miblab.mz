<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Carbon\Carbon;
use Auth;
use DB;

#models
use App\CCosts;
use App\Costs;


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
            })->orderBy('id', 'desc')->get();
        # admin, cashier | one points
        } else {
            $costs = Costs::whereHas('pivot', function($query) use($id){
                $query->where('ccosts_id', $id)
                      ->where('point', Auth::user()->point);
            })->orderBy('id', 'desc')->get();
        }

    	return view('costs.costs', compact('ccosts', 'costs'));
    }

    # costs range date
    public function date(Request $request)
    {
        $ccosts = CCosts::find($request->id)->name;
        $dateStart = Carbon::createFromFormat('d/m/Y', $request->dateStart)->addDay(1)->format('Y-m-d');
        $dateEnd = Carbon::createFromFormat('d/m/Y', $request->dateEnd)->addDay(1)->format('Y-m-d');

        $costs = Costs::whereHas('pivot', function($query) use($request, $dateStart, $dateEnd)
            {
                $query->where('ccosts_id', $request->id)
                      ->whereBetween('date', [$dateStart, $dateEnd]);
            })->orderBy('id', 'desc')->get();

        $data = []; $total = []; $extra = []; $i = 0;

        if(count($costs) > 0)
        {
            foreach($costs as $row):
                $i++;
                $data[$i]['date'] = $row->date_format;
                $data[$i]['sum']  = number_format($row->sum, 0, ' ', ' ');

                $total[$i]['sum'] = $row->sum;
            endforeach;

            $extra['totalSum'] = number_format(array_sum(array_column($total, 'sum')), 0, ' ', ' ');
            $status = 1;
        } else {
            $data = 'Нет расходов за период';
            $status = 0;
        }

        return response()->json(['status' => $status, 'data' => $data, 'extra' => $extra]);

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
        $request['date'] = Carbon::createFromFormat('d/m/Y', $request['date'])->format('Y-m-d');
    	$row = $costs::create($request->all());
    	$costs->ccosts()
        ->sync([$request->ccosts_id => ['costs_id' => $row->id]]);

    	return response()->json(['status' => 1, 'message' => $request->ccosts_id]);      
    }

    # update
    public function update(Request $request, $id)
    {
        $col = $request->col;
        $val = $request->val;
        $data = [];

        $costs = Costs::find($request->id);
        $costs->$col = $val;
        $costs->save();

        $totalSum = CCosts::find($id)->costs()->sum('sum');

        $data['value'] = number_format($val, 0, ' ', ' ');
        $data['totalSum'] = number_format($totalSum, 0, ' ', ' ');

        return response()->json(['status' => 1, 'message' => 'Обновлено', 'data' => $data]);
    }

    # delete
    public function destroy(Request $request, $id)
    {
        $costs = Costs::find($request->id);
        $data = [];

        $count = CCosts::find($id)->costs()->count();
        if($count == 1)
        {
            $status = 'redirect';
            $costs->delete();
            $costs->ccosts()->detach();
        } else {
            $status = 1;
            $costs->delete();
            $costs->ccosts()->detach();
            $sum = CCosts::find($id)->costs()->sum('sum');
            $data['totalSum'] = number_format($sum, 0, ' ', ' ');
        }

        return response()->json(['status' => $status, 'message' => 'Удалено', 'data' => $data]);
    }
}
