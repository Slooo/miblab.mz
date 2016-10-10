@extends('app')

@section('content')

<?php
function TotalSum($id)
{
	$sum = DB::table('costs AS c')
	        ->LeftJoin('ccosts_costs AS ccc', 'ccc.costs_id', '=', 'c.id')
	        ->LeftJoin('ccosts AS cc', 'ccc.ccosts_id', '=', 'cc.id')
	        ->where('cc.id', $id)
	        ->sum('c.sum');
	return $sum;
}

function MonthSum($id, $month)
{
	$sum = DB::table('costs AS c')
	        ->LeftJoin('ccosts_costs AS ccc', 'ccc.costs_id', '=', 'c.id')
	        ->LeftJoin('ccosts AS cc', 'ccc.ccosts_id', '=', 'cc.id')
			->where('date', '>=', $month)
			->where('cc.id', $id)
	        ->sum('c.sum');
	return $sum;
}

function TotalSumPointMonth($id, $days30)
{
	$sum = DB::table('items_orders AS io')
	        ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
	        ->where('io.created_at', '>=', $days30)
	        ->where('points_id', $id)
	        ->sum('o.sum');
	return $sum;
}
?>
<div class="row">
	
	<div class="col-md-12">
		<h2>Аналитика</h2>
		<hr>
	</div>

	<div class="col-md-6">
		<table class="table table-bordered">
			<thead>
				<tr>
					<th colspan="2">За весь период</th>
				</tr>
			</thead>
			<tbody>
				@foreach($ccosts as $row)
				<tr>
					<td>{{ $row->name }}</td>
					<td class="js-analytics-all--sum">{{ TotalSum($row->id) }}</td>
				</tr>
				@endforeach
				<tr>
					<td>Итого: </td>
					<td id="js-analytics-all-total"></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered">
			<thead>
				<tr>
					<th colspan="2">Текущий месяц</th>
				</tr>
			</thead>
			<tbody>
				@foreach($ccosts as $row)
				<tr>
					<td>{{ $row->name }}</td>
					<td class="js-analytics-month--sum">{{ MonthSum($row->id, $month) }}</td>
				</tr>
				@endforeach
				<tr>
					<td>Итого: </td>
					<td id="js-analytics-month-total"></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="col-md-6">
		<table class="table table-bordered">
			<tbody>
				<tr>
					<td>Закупка за 30 дней</td>
					<td></td>
				</tr>
				<tr>
					<td>Реализация за 30 дней</td>
					<td>{{ $sum }}</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered">
			<thead>
				<tr>
					<th colspan="2">Доход</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>За 30 дней</td>
					<td></td>
				</tr>
				<tr>
					<td>Накопительно</td>
					<td></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered">
			<tbody>
				<tr>
					<td>Прибыль дневная средняя в день</td>
					<td></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered">
			<thead>
				<tr>
					<th colspan="2">Прибыль понедельно по точкам (за 30 дней)</th>
				</tr>
			</thead>
			<tbody>
				@foreach($points as $row)
				<tr>
					<td>Точка {{ $row->point }}</td>
					<td class="js-analytics-point-month--sum">{{ TotalSumPointMonth($row->point, $days30) }}</td>
				</tr>
				@endforeach
				<tr>
					<td>Итого: </td>
					<td id="js-analytics-point-month-total"></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered">
			<thead>
				<tr>
					<th colspan="2">Прибыль понедельно (за 30 дней)</th>
				</tr>
			</thead>
			<tbody>
			@foreach($date_week as $key => $val)
				<tr>
				<td>{{ $val->format('d/m/Y') }}</td>
					@if($sum_week[$key])
						@foreach($sum_week[$key] as $total)
							<td class="js-analytics-week-30day--sum">{{ $total }}</td>
						@endforeach
					@else
							<td></td>
					@endif
				</tr>
				@endforeach
				<tr>
					<td>Итого: </td>
					<td id="js-analytics-week-30day-total"></td>
				</tr>
			</tbody>
		</table>
	</div>

</div>

@stop

<style>
	.table th {
		text-align:center;
	}
</style>