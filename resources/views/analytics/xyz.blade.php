@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>XYZ анализ</h2>
		<hr>
	</div>

	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">

	<table class="table table-bordered table-striped">
		@foreach($items_month as $item => $val)
			@foreach($months_list as $k => $month)
				@if($k == $item)
				<thead>
					<th>{{ $month }}</th>
				</thead>
				@endif
			@endforeach
				<tbody>
				@foreach($val as $row)
					<tr>
						<td>{{ $row['items_id'] }}</td>
						<td>{{ $row['items_name'] }}</td>
						<td>{{ $row['items_sum'] }}</td>
					</tr>
				@endforeach
				</tbody>
		@endforeach
	</table>


	месяцы
	$month = ['январь, февраль и тд'];

	items_month = [item_id, name, month];

	коэффициент [item_id, сам коэф];


	</div>

	<div class="col-md-12 col-footer">
		<hr>
	</div>

</div>

@stop
