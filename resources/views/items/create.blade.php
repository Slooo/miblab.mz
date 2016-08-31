@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Внесение полученного товара под реализацию</h2>
		<hr>
	</div>

	<div class="col-md-8 col-md-offset-2">
		@include('items.form_update')
	</div>

</div>

@stop