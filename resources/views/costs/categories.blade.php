@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Учёт расходов</h2>
		<hr>
	</div>
	
	<div class="col-md-8 col-md-offset-4">
		<div class="btn-group-vertical">
		@foreach($ccosts as $row)
			<a href="{{ url(Request::segment(1).'/costs/'.$row->id) }}" class="btn btn-default">{{ $row->name }}</a>
		@endforeach
		</div>
	</div>

</div>

@stop