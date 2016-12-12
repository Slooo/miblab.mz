@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>XYZ анализ</h2>
		<hr>
	</div>

	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">

		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>Наименование</th>
					@foreach($months_list as $k => $month)
					<th>{{ $month }}</th>
					@endforeach
					<th>Коэффициент вариации</th>
					<th>Группы</th>
				</tr>
			</thead>

			<tbody>
			@foreach($months_list as $k => $month)
				@foreach($items_month as $key => $val)
					@if($key == $k)

					@if($val['xyz'] < 10)
					<tr class="success">
					@elseif($val['xyz'] > 10 && $val['xyz'] < 25)
					<tr class="info">
					@elseif($val['xyz'] > 25)
					<tr class="danger">
					@endif

						@foreach($val as $row)
							<td>{{ $row['items_name'] }}</td>
							@break
						@endforeach

						@foreach($val as $row)
							@if(!empty($row['items_sum']))
							<td>{{ $row['items_sum'] }}</td>
							@endif
						@endforeach

						<td>{{ $val['xyz'] }}%</td>

						@if($val['xyz'] < 10)
						<td>X</td>
						@elseif($val['xyz'] > 10 && $val['xyz'] < 25)
						<td>Y</td>
						@elseif($val['xyz'] > 25)
						<td>Z</td>
						@endif

					</tr>
					@endif
				@endforeach
			@endforeach
			</tbody>
			
		</table>

	</div>

	<div class="col-md-12 col-footer">
		<hr>
	</div>

</div>

@stop
