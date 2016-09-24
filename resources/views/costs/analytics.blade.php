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
	</div>

	<div class="col-md-6">
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

</div>

@stop

<style>
	.table th {
		text-align:center;
	}
</style>