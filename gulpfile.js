var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

	mix.sass('app.scss')

	// стили
	.styles([
		'../bower/bootstrap/dist/css/bootstrap.min.css',
		'../bower/font-awesome/css/font-awesome.min.css',
		'bootstrap-datetimepicker.min.css',
		'main.css', 
		], 'public/css/app.css')

	// скрипты
	.scripts([
		'main.js', 
		'cashier.js', 
		'costs.js', 
		'orders.js',
		'supply.js',
		'items.js',
		'settings.js',
		], 'public/js/app.js')

	// библиотеки
	.scripts([
		'../bower/jquery/jquery.min.js',
		'moment-with-locales.min.js', 
		'bootstrap-datetimepicker.min.js', 
		'jquery.numeric.min.js'
		], 'public/js/libs.js')

	.version(['css/app.css', 'js/app.js', 'js/libs.js'])
    
});
