@extends('app')

@section('content')

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
		<tr>
			<td>{{ $row['name'] }}</td>
			<td>{{ number_format($row['profit'], 0, ' ', ' ') }}</td>
			<td>{{ $row['share'] }}%</td>
			<td>{{ $row['share_storage'] }}%</td>
			<td>{{ $row['group'] }}</td>
		</tr>
		@endforeach

		</tbody>
	</table>

@stop