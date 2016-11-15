<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Storage;

class MainController extends Controller
{
    // storage/app/settings.json
    public function show_discount()
    {
    	$file = Storage::disk('local')->get('settings.json');
    	$data = json_decode($file, true);

    	$discount = $data['discount'];
    	return view('settings/discount', compact('discount'));
    }

    // storage/app/settings.json
    public function update_discount(Request $request)
    {
    	$file = Storage::disk('local')->get('settings.json');
    	$data = json_decode($file, true);

    	$id = $request->id;
    	$key = $request->key;
    	$value = (int)$request->value;

    	// set
    	$data['discount'][$id][$key] = $value;

    	$save = json_encode($data);

    	// save
    	Storage::disk('local')->put('settings.json', $save);
    	return response()->json(['status' => 1]);
    }
}
