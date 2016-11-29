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
	Route::get('analytics/abc', 'MainController@abc');
	Route::get('xyz', 'MainController@xyz');
	Route::get('analytics', 'MainController@analytics');

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

# Admin
Route::group(['middleware' => ['auth', 'admin'], 'prefix' => 'admin'], function()
{
	# post
	Route::post('discounts/restore', 'DiscountsController@restore');

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
	Route::resource('discounts', 'DiscountsController');
});

# Igor
Route::group(['middleware' => ['auth', 'igor'], 'prefix' => 'igor'], function()
{
	# get
	Route::get('analytics/abc', 'MainController@abc');
	Route::get('xyz', 'MainController@xyz');

	Route::get('analytics', 'MainController@analytics');
	Route::get('items/search', 'ItemsController@cashier');

	# patch
	Route::patch('items/status', 'ItemsController@status');
	Route::patch('orders/date', 'OrdersController@date');
	Route::patch('costs/date', 'CostsController@date');
	Route::patch('supply/date', 'SupplyController@date');
	Route::patch('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::patch('items/search', 'ItemsController@search');

	#post
	Route::post('orders/delete/{id}','OrdersController@delete');
	Route::post('discounts/delete/{id}','DiscountsController@delete');
	Route::post('costs/delete/{id}','CostsController@delete');

	Route::post('items/barcode', 'ItemsController@barcode');
	Route::post('discounts/restore', 'DiscountsController@restore');
	Route::post('orders/restore', 'OrdersController@restore');	
	Route::post('costs/restore', 'CostsController@restore');	

	#resource
	Route::resource('items', 'ItemsController');
	Route::resource('orders', 'OrdersController');
	Route::resource('costs', 'CostsController');
	Route::resource('supply', 'SupplyController');
	Route::resource('discounts', 'DiscountsController');
});