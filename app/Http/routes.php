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
		    return redirect('cashier/orders');
		    break;

		    case 3:
		    return redirect('igor/analytics');
		}
	} else {
		return redirect('login');
	}
});

# Cashier
Route::group(['middleware' => ['auth', 'cashier'], 'prefix' => 'cashier'], function()
{
	#get
	Route::get('items', 'ItemsController@index');
	Route::get('orders/create', 'OrdersController@create');
	Route::get('orders', 'OrdersController@index');
	Route::get('orders/{id}', 'OrdersController@show');

	#patch
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');
	Route::patch('stock/quantity', 'ItemsController@stock_quantity');

	# post
	Route::post('items/barcode', 'ItemsController@barcode');
	Route::post('orders', 'OrdersController@store');
});

# Admin
Route::group(['middleware' => ['auth', 'admin'], 'prefix' => 'admin'], function()
{
	# patch
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');

	# resource
	Route::resource('items', 'ItemsController');
	Route::resource('orders', 'OrdersController');
	Route::resource('costs', 'CostsController');
	Route::resource('supply', 'SupplyController');
});

# Manage
Route::group(['middleware' => ['auth', 'manage'], 'prefix' => 'manage'], function()
{
	# get
	Route::get('analytics', 'OrdersController@analytics');

	# patch
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');

	# resource
	Route::resource('items', 'ItemsController');
	Route::resource('orders', 'OrdersController');
	Route::resource('costs', 'CostsController');
	Route::resource('supply', 'SupplyController');
});

# Igor
Route::group(['middleware' => ['auth', 'igor'], 'prefix' => 'igor'], function()
{
	# get
	Route::get('discount', 'MainController@show_discount');

	Route::get('analytics', 'OrdersController@analytics');
	Route::get('items/search', 'ItemsController@cashier');

	# patch
	Route::patch('discount', 'MainController@update_discount');
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');

	#post
	Route::post('items/barcode', 'ItemsController@barcode');

	#resource
	Route::resource('items', 'ItemsController');
	Route::resource('orders', 'OrdersController');
	Route::resource('costs', 'CostsController');
	Route::resource('supply', 'SupplyController');
});