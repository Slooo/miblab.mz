<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CostsRequest;
use App\Http\Requests;
use Carbon\Carbon;
use Auth;
use DB;
use Session;

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
        $ccosts = CCosts::findOrFail($id)->name;

        # manage | all points
        if(Auth::user()->points_id == 0)
        {
            $costs = Costs::whereHas('pivot', function($query) use($id){
                $query->where('ccosts_id', $id);
            })->orderBy('id', 'desc')->get();
        # admin, cashier | one points
        } else {
            $costs = Costs::whereHas('pivot', function($query) use($id){
                $query->where('ccosts_id', $id)
                      ->where('points_id', Auth::user()->points_id);
            })->orderBy('id', 'desc')->get();
        }

    	return view('costs.costs', compact('ccosts', 'costs'));
    }

    # costs range date
    public function date(Request $request)
    {
        $data = []; $total = []; $extra = []; $i = 0;

        $ccosts = CCosts::find($request->id)->name;
        $dateStart = Carbon::createFromFormat('d/m/Y', $request->dateStart)->addDay(1)->format('Y-m-d');
        $dateEnd = Carbon::createFromFormat('d/m/Y', $request->dateEnd)->addDay(1)->format('Y-m-d');

        $costs = Costs::whereHas('pivot', function($query) use($request, $dateStart, $dateEnd)
            {
                $query->where('ccosts_id', $request->id)
                      ->whereBetween('date', [$dateStart, $dateEnd]);
            })->orderBy('id', 'desc')->get();

        if(count($costs) > 0)
        {
            foreach($costs as $row):
                $i++;
                $data[$i]['id']   = $row->id;
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

    # create
    public function store(CostsRequest $request)
    {
    	$costs = new Costs;
        $request['date'] = Carbon::createFromFormat('d/m/Y', $request['date'])->format('Y-m-d');
    	$data = $costs::create($request->all());
    	$costs->ccosts()
        ->sync([$request->ccosts_id => ['costs_id' => $data->id]]);

    	return response()->json(['message' => 'Расходы внесены', 'data' => $data]);      
    }

    # update
    public function update(Request $request, $id)
    {
        $column = $request->column;
        $value = $request->value;

        $costs = Costs::find($id);
        $costs->$column = $value;
        $costs->save();

        return response()->json(['message' => 'Обновлено']);
    }

    # delete
    public function delete(Request $request, $id)
    {
        if($request->type == 'pivot')
        {
            //$pivot = Costs::findOrFail($id);
            $pivot = CCosts::find($request->id)->costs()->where('costs.id', $id)->first();
            Session::flash('restore_pivot', $pivot);

            $count = CCosts::find($request->id)->costs()->count();
            if($count == 1)
            {
                $pivot->delete();
                $pivot->ccosts()->detach();
                // redirect
            } else {
                $pivot->delete();
                $pivot->ccosts()->detach();
            }
        }

        return response()->json(['message' => 'Удалено', 'data' => $id]);
    }

    # restore
    public function restore()
    {
        if(Session::has('restore_pivot'))
        {
            $data = Session::get('restore_pivot');
            $costs = new Costs;

            $costs->id = $data->id;
            $costs->sum = $data->sum;
            $costs->date = $data->date;
            $costs->points_id = $data->points_id;

            $costs->save();
            $costs->ccosts()->sync([$costs->id => ['ccosts_id' => $data->pivot->ccosts_id, 'costs_id' => $costs->id]]);

            $status = 1;
            $message = 'Восстановлено';
        } else {
            $costs = [];
            $status = 0;
            $message = 'Восстановить не удалось';
        }

        return response()->json(['status' => $status, 'message' => $message, 'data' => $costs]);
    }
}
