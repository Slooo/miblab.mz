<!-- 

	ABC analysis

-->

@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>ABC анализ</h2>
		<hr>
	</div>

	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">

		<table class="table table-striped table-bordered">
			<thead>
				<th>Наименование товаров</th>
				<th>Прибыль</th>
				<th>Доля</th>
				<th>Накопительная доля</th>
				<th>Группа ABC</th>
			</thead>
			<tbody>
				@foreach($abc as $row)
				@if($row['group'] == 'A')
				<tr class="success">
				@elseif($row['group'] == 'B')
				<tr class="info">
				@elseif($row['group'] == 'C')
				<tr class="danger">
				@endif

				<td>{{ $row['name'] }}</td>
				<td>{{ number_format($row['profit'], 0, ' ', ' ') }}</td>
				<td>{{ $row['share'] }}%</td>
				<td>{{ $row['share_storage'] }}%</td>
				<td>{{ $row['group'] }}</td>
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