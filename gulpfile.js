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
		'../bower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
		'main.css', 
	], 'public/css/app.css')

	// скрипты
	.scripts([
		'main.js',
		'items.js',
		'orders.js',
		'supply.js',
		'costs.js',
		'discounts.js',
		'settings.js',
	], 'public/js/app.js')

	// библиотеки
	.scripts([
		'../bower/jquery/jquery.min.js',
		'../bower/bootstrap/dist/js/bootstrap.min.js',
		'../bower/moment/min/moment-with-locales.min.js',
		'../bower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
		'../bower/jquery-numeric/dist/jquery-numeric.js',
	], 'public/js/libs.js')

	.version(['css/app.css', 'js/app.js', 'js/libs.js'])
    
});
