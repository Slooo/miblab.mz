<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Session;

use App\Discounts;

class DiscountsController extends Controller
{
    public function index()
    {
    	$discounts = Discounts::orderBy('id', 'desc')->get();
    	return view('settings.discounts', compact('discounts'));
    }

    public function store(Request $request)
    {
    	$discounts = Discounts::create($request->all());
    	
    	if(count($discounts)){
    		$status = 1;
    		$message = 'Создано';
    	} else {
    		$discounts = [];
    		$status = 0;
    		$message = 'Не создано';
    	}

    	return response()->json(['status' => $status, 'message' => $message, 'data' => $discounts]);
    }

    public function update(Request $request, $id)
    {
		$column = $request->column;
		$value = (int)$request->value;

		$discounts = Discounts::where('id', $id)->update([$column => $value]);
		return response()->json(['status' => 1, 'message' => 'Обновлено']);
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
