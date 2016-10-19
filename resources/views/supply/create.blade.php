@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Внесение прихода</h2>
		<hr>
	</div>

	<div class="col-md-8 col-md-offset-2">
		@include('_forms.items_update')
	</div>

</div>

@stop