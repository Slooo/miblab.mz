@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Учёт расходов</h2>
		<hr>
	</div>

	<div class="col-md-6 col-md-offset-3">
		@include('costs.form_costs', [$ccosts])
	</div>

</div>

@stop