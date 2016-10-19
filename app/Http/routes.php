<?php
Route::auth();

# Index
Route::get('/', function() {
	if(\Auth::user())
	{
		switch(\Auth::user()->status)
		{
		    case 0:
		    return redirect('manage/analytics');
		    break;

		    case 1:
		    return redirect('admin/items');
		    break;

		    case 2:
		    return redirect('cashier/items/search');
		    break;
		}
	} else {
		return redirect('login');
	}
});

# Cashier
Route::group(['middleware' => ['auth', 'cashier'], 'prefix' => 'cashier'], function()
{
	#get
	Route::get('items/search', 'ItemsController@cashier');
	Route::get('orders', 'OrdersController@index');

	# post
	Route::post('items/barcode', 'ItemsController@barcode');
	Route::post('items/search', 'ItemsController@search');

	#resource
	Route::resource('items', 'ItemsController');
});

# Admin
Route::group(['middleware' => ['auth', 'admin'], 'prefix' => 'admin'], function()
{
	# get
	Route::get('items', 'ItemsController@index');
	Route::get('items/create', 'ItemsController@create');
	Route::get('costs', 'CostsController@index');
	Route::get('costs/create', 'CostsController@create');
	Route::get('orders', 'OrdersController@index');
	Route::get('supply', 'SupplyController@index');
	Route::get('supply/create', 'SupplyController@create');

	# patch
	Route::patch('items/status', 'ItemsController@status');

	# post
	Route::post('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::post('items/search', 'ItemsController@search');
	Route::post('orders/date', 'OrdersController@date');
	Route::post('supply/date', 'SupplyController@date');
	Route::post('costs/date', 'CostsController@date');

	# resource
	Route::resource('items', 'ItemsController');
	Route::resource('order', 'OrdersController');
	Route::resource('costs', 'CostsController');
	Route::resource('supply', 'SupplyController');
});

# Manage
Route::group(['middleware' => ['auth', 'manage'], 'prefix' => 'manage'], function()
{
	# get
	Route::get('analytics', 'OrdersController@analytics');
	Route::get('orders', 'OrdersController@index');
	Route::get('costs', 'CostsController@index');

	#post
	Route::post('orders/date', 'OrdersController@date');
	Route::post('costs/date', 'CostsController@date');

	# resource
	Route::resource('items', 'ItemsController');
	Route::resource('order', 'OrdersController');
	Route::resource('costs', 'CostsController');
});