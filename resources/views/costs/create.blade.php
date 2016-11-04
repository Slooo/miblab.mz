@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Расходы</h2>
		<hr>
	</div>

	<div class="col-md-6 col-md-offset-3">
		@include('_forms.costs_create', [$ccosts])
	</div>

</div>

@stop