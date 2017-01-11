<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\DiscountsRequest;
use App\Http\Requests;
use Session;
use Validator;

use App\Discounts;

class DiscountsController extends Controller
{
    public function index()
    {
    	$discounts = Discounts::orderBy('id', 'desc')->get();
    	return view('discounts.discounts', compact('discounts'));
    }

    public function store(DiscountsRequest $request)
    {
    	$discounts = Discounts::create($request->all());
    	return response()->json(['message' => 'Создано', 'data' => $discounts]);
    }

    public function update(Request $request, $id)
    {
        switch($request->column)
        {
            case 'sum':
                $check = 'required|numeric';
            break;

            case 'percent':
                $check = 'required|numeric|max:100';
            break;

            default:
                return false;
            break;
        }

        $validator = Validator::make($request->all(), [
            'value' => $check
        ]);

        if ($validator->fails()) {
            $message = $validator->messages();
            $status = 422;
        } else {
            $column = $request->column;
            $value = $request->value;

            Discounts::where('id', $id)->update([$column => $value]);
            
            $message = 'Обновлено';
            $status = 200;
        }

        return response()->json(['message' => $message], $status);
    }

    public function delete(Request $request, $id)
    {
        $main = Discounts::find($id);
        $main->delete();
        Session::flash('restore_main', $main);
        // if count 0 return 301
        return response()->json(['status' => 1, 'message' => 'Удалено', 'data' => $id]);
    }

    public function restore()
    {
    	if(Session::has('restore_main'))
    	{
    		$data = Session::get('restore_main');
    		$discounts = new Discounts;

    		$discounts->id = $data->id;
    		$discounts->sum = $data->sum;
    		$discounts->percent = $data->percent;

    		$discounts->save();

    		$status = 1;
    		$message = 'Восстановлено';
    	} else {
    		$discounts = [];
    		$status = 0;
    		$message = 'Восстановить не удалось';
    	}

    	return response()->json(['status' => $status, 'message' => $message, 'data' => $discounts]);
    }
}
