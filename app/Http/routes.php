<?php
Route::auth();

# auth
//Route::get('login', 'Auth\AuthController@getLogin');
//Route::post('login', 'Auth\AuthController@postLogin');
//Route::get('logout', 'Auth\AuthController@getLogout');

# no auth
Route::group(['middleware' => 'web', 'middleware' => 'auth'], function()
{
	Route::get('/', 'ItemsController@home');
	Route::get('items/cashier', 'ItemsController@cashier');
	Route::get('analytics', 'CostsController@analytics');

	Route::get('cashier/search', function () {
	    return redirect('/cashier');
	});

	Route::post('items/barcode', 'ItemsController@barcode');
	Route::post('items/search', 'ItemsController@search');
	Route::patch('items/status', 'ItemsController@status');
	Route::post('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::post('order/orders', 'OrderController@orders');
	Route::resource('order', 'OrderController');
	Route::resource('items', 'ItemsController');
	Route::resource('costs', 'CostsController');
});