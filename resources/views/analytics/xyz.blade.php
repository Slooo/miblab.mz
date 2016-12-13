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
				@foreach($items_month['months'] as $month)
					<th>{{ $month }}</th>
				@endforeach
					<th>Коэффициент вариации</th>
					<th>Группы</th>
				</tr>
			</thead>

			<tbody>
			@foreach($items_month['items'] as $key => $val)

				@if($val['group'] == 'X')
				<tr class="success">
				@elseif($val['group'] == 'Y')
				<tr class="info">
				@elseif($val['group'] == 'Z')
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
					<td>{{ $val['group'] }}</td>
				</tr>
			@endforeach
			</tbody>

		</table>

	</div>

	<div class="col-md-12 col-footer">
		<hr>
	</div>

</div>

@stop
