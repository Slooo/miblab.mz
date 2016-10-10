<?php
Route::auth();

# auth
//Route::get('login', 'Auth\AuthController@getLogin');
//Route::post('login', 'Auth\AuthController@postLogin');
//Route::get('logout', 'Auth\AuthController@getLogout');

# no auth
Route::group(['middleware' => 'web', 'middleware' => 'auth'], function()
{
	# get
	Route::get('/', 'ItemsController@home');
	Route::get('items/cashier', 'ItemsController@cashier');
	Route::get('manage/analytics', 'ManageController@index');
	Route::get('manage/orders', 'ManageController@orders');
	Route::get('cashier/search', function () {
	    return redirect('/cashier');
	});

	# patch
	Route::patch('items/status', 'ItemsController@status');

	# post
	Route::post('items/barcode/generate', 'ItemsController@barcode_generate');
	Route::post('order/orders', 'OrderController@orders');
	Route::post('items/barcode', 'ItemsController@barcode');
	Route::post('items/search', 'ItemsController@search');

	# resource
	Route::resource('order', 'OrderController');
	Route::resource('items', 'ItemsController');
	Route::resource('costs', 'CostsController');
	#Route::resource('manage', 'ManageController');
});