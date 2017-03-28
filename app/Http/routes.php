<?php
Route::auth();

# Index
Route::get('/', function() {
	if(\Auth::user())
	{
		switch(\Auth::user()->status)
		{
		    case 1:
		    return redirect('cashier/orders');
		    break;

		    case 2:
		    return redirect('manage/analytics');
		    break;

		    case 3:
		    return redirect('admin/items');
		    break;

		    case 4:
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

# Manage
Route::group(['middleware' => ['auth', 'manage'], 'prefix' => 'manage'], function()
{
	# get
	Route::get('analytics', 'MainController@analytics');
	Route::get('analytics/{graphics}', 'MainController@analytics');
	Route::get('analytics/abc', 'MainController@abc');
	Route::get('analytics/xyz', 'MainController@xyz');
	Route::get('items', 'ItemsController@index');
	Route::get('orders', 'OrdersController@index');
	Route::get('orders/{id}', 'OrdersController@show');
	Route::get('supply', 'SupplyController@index');
	Route::get('supply/{id}', 'SupplyController@show');
	Route::get('costs', 'CostsController@index');
	Route::get('costs/{id}', 'CostsController@show');

	# patch
	Route::patch('items/search', 'ItemsController@search');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('supply/date', 'SupplyController@date');
});

# Admin
Route::group(['middleware' => ['auth', 'admin'], 'prefix' => 'admin'], function()
{
	# get
	Route::get('items','ItemsController@index');
	Route::get('items/{id}','ItemsController@show');
	Route::get('orders','OrdersController@index');
	Route::get('orders/{id}','OrdersController@show');
	Route::get('supply','SupplyController@index');
	Route::get('supply/{id}','SupplyController@show');
	Route::get('costs','CostsController@index');
	Route::get('costs/{id}','CostsController@show');
	Route::get('discounts','DiscountsController@index');

	# post
	Route::post('items', 'ItemsController@store');
	Route::post('supply', 'SupplyController@store');
	Route::post('costs', 'CostsController@store');
	Route::post('discounts', 'DiscountsController@store');
	Route::post('items/delete/{id}','ItemsController@delete');
	Route::post('supply/delete/{id}','SupplyController@delete');
	Route::post('orders/delete/{id}','OrdersController@delete');
	Route::post('discounts/delete/{id}','DiscountsController@delete');
	Route::post('costs/delete/{id}','CostsController@delete');

	# patch
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('items/{id}','ItemsController@update');
	Route::patch('costs/{id}','CostsController@update');
	Route::patch('supply/{id}','SupplyController@update');
});

# Igor
Route::group(['middleware' => ['auth', 'igor'], 'prefix' => 'igor'], function()
{
	# get
	Route::get('items','ItemsController@index');
	Route::get('items/{id}','ItemsController@show');
	Route::get('items/search', 'ItemsController@cashier');
	Route::get('orders','OrdersController@index');
	Route::get('orders/{id}','OrdersController@show');
	Route::get('supply','SupplyController@index');
	Route::get('supply/{id}','SupplyController@show');
	Route::get('costs','CostsController@index');
	Route::get('costs/{id}','CostsController@show');
	Route::get('discounts','DiscountsController@index');
	Route::get('analytics', 'MainController@analytics');
	Route::get('analytics/{graphics}', 'MainController@analytics');
	Route::get('analytics/abc', 'MainController@abc');
	Route::get('analytics/xyz', 'MainController@xyz');

	# patch
	Route::patch('items/search', 'ItemsController@search');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('items/{id}','ItemsController@update');
	Route::patch('costs/{id}','CostsController@update');
	Route::patch('supply/{id}','SupplyController@update');

	#post
	Route::post('items', 'ItemsController@store');
	Route::post('orders','OrdersController@store');
	Route::post('supply', 'SupplyController@store');
	Route::post('costs', 'CostsController@store');
	Route::post('discounts', 'DiscountsController@store');
	Route::post('items/delete/{id}','ItemsController@delete');
	Route::post('supply/delete/{id}','SupplyController@delete');
	Route::post('orders/delete/{id}','OrdersController@delete');
	Route::post('discounts/delete/{id}','DiscountsController@delete');
	Route::post('costs/delete/{id}','CostsController@delete');
});