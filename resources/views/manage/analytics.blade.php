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
	if(count($sum) > 0)
	{
		return $sum;		
	} else {
		return 0;
	}
}

function MonthSum($id, $month)
{
	$sum = DB::table('costs AS c')
	        ->LeftJoin('ccosts_costs AS ccc', 'ccc.costs_id', '=', 'c.id')
	        ->LeftJoin('ccosts AS cc', 'ccc.ccosts_id', '=', 'cc.id')
			->where('date', '>=', $month)
			->where('cc.id', $id)
	        ->sum('c.sum');
	if(count($sum) > 0)
	{
		return $sum;		
	} else {
		return 0;
	}
}

function TotalSumPointMonth($id, $days30)
{
	$sum = DB::table('items_orders AS io')
	        ->LeftJoin('orders AS o', 'o.id', '=', 'io.orders_id')
	        ->where('io.created_at', '>=', $days30)
	        ->where('points_id', $id)
	        ->sum('o.sum');
	if(count($sum) > 0)
	{
		return $sum;		
	} else {
		return 0;
	}
}
?>
<div class="row">
	
	<div class="col-md-12">
		<h2>Аналитика</h2>
		<hr>
	</div>

	<div class="col-md-6">
		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">За весь период</th>
				</tr>
			</thead>
			<tbody>
				@foreach($ccosts as $row)
				<tr>
					<?php $total_sum[] = TotalSum($row->id);?>
					<td class="col-md-9">{{ $row->name }}</td>
					<td class="col-md-3 analytics--number-format">{{ number_format(TotalSum($row->id), 0, ' ', ' ') }}</td>
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">{{ number_format(array_sum($total_sum), 0, ' ',' ') }}</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Текущий месяц</th>
				</tr>
			</thead>
			<tbody>
				@foreach($ccosts as $row)
				<tr>
					<?php $total_sum_month[] = MonthSum($row->id, $month);?>
					<td class="col-md-9">{{ $row->name }}</td>
					<td class="col-md-3 analytics--number-format">{{ MonthSum($row->id, $month) }}</td>
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">{{ number_format(array_sum($total_sum_month), 0, ' ', ' ') }}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="col-md-6">
		<table class="table table-bordered analytics-table">
			<tbody>
				<tr>
					<td class="col-md-9">Закупка за 30 дней</td>
					<td class="col-md-3 analytics--number-format"></td>
				</tr>
				<tr>
					<td class="col-md-9">Реализация за 30 дней</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sum, 0, ' ', ' ') }}</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Доход</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="col-md-9">За 30 дней</td>
					<td class="col-md-3 analytics--number-format"></td>
				</tr>
				<tr>
					<td class="col-md-9">Накопительно</td>
					<td class="col-md-3 analytics--number-format"></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<tbody>
				<tr>
					<td class="col-md-9">Прибыль дневная средняя в день</td>
					<td class="col-md-3 analytics--number-format"></td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Прибыль понедельно по точкам (за 30 дней)</th>
				</tr>
			</thead>
			<tbody>
				@foreach($points as $row)
				<tr>
					<?php $total_sum_pointMonth[] = TotalSumPointMonth($row->point, $days30);?>
					<td class="col-md-9">Точка {{ $row->point }}</td>
					<td class="col-md-3 analytics--number-format">{{ number_format(TotalSumPointMonth($row->point, $days30), 0, ' ', ' ') }}</td>
				</tr>
				
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">{{ number_format(array_sum($total_sum_pointMonth), 0, ' ', ' ') }}</td>
				</tr>
				@endforeach
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Прибыль понедельно (за 30 дней)</th>
				</tr>
			</thead>
			<tbody>
			@foreach($date_week as $key => $val)
				<tr>
				<td class="col-md-9">{{ $val->format('d/m/Y') }}</td>
					@if($sum_week[$key])
						@foreach($sum_week[$key] as $total)
							<?php $total_sum_week[] = $total;?>
							<td class="col-md-3 analytics--number-format">{{ number_format($total, 0, ' ', ' ') }}</td>
						@endforeach
					@else
							<td class="col-md-3 analytics--number-format">0</td>
					@endif
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">{{ number_format(array_sum($total_sum_week), 0, ' ',' ') }}</td>
				</tr>
			</tbody>
		</table>
	</div>

</div>

@stop