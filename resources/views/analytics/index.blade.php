<!-- 

	Index page analytics 

-->

@extends('app')

@section('content')

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
				@foreach($sumAll as $row)
				<tr>
					<td class="col-md-9">{{ $row['costs'] }}</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($row['sum'], 0, ' ', ' ') }}
					</td>
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format(array_sum(array_column($sumAll, 'sum')), 0, ' ', ' ') }}				
					</td>
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
				@foreach($sumMonth as $row)
				<tr>
					<td class="col-md-9">{{ $row['costs'] }}</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($row['sum'], 0, ' ', ' ') }}
					</td>
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format(array_sum(array_column($sumMonth, 'sum')), 0, ' ', ' ') }}				
					</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Ключевые показатели</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="col-md-9">Прибыль</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sumAllKey['profit'], 0, ' ', ' ') }}</td>
				</tr>
				<tr>
					<td class="col-md-9">Продажи</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sumAllKey['orders'], 0, ' ', ' ') }}</td>
				</tr>
				<tr>
					<td class="col-md-9">Расходы</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sumAllKey['costs'], 0, ' ', ' ') }}</td>
				</tr>
				<tr>
					<td class="col-md-9">Закупка</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sumAllKey['supply'], 0, ' ', ' ') }}</td>
				</tr>
				<tr>
					<td class="col-md-9">Склад</td>
					<td class="col-md-3 analytics--number-format">{{ number_format($sumAllKey['stock'], 0, ' ', ' ') }}</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Ключевые показатели (по точкам)</th>
				</tr>
			</thead>
			<tbody>
			@foreach($sumAllKeyPoint as $key => $row)
			<tr>
				<td class="analytics--point" colspan="2">Точка #{{ $key }}</td>
			</tr>
			<tr>
				<td class="col-md-9">Прибыль</td>
				<td class="col-md-3 analytics--number-format">{{ number_format($row['profit'], 0, ' ', ' ') }}</td>
			</tr>
			<tr>
				<td class="col-md-9">Продажи</td>
				<td class="col-md-3 analytics--number-format">{{ number_format($row['orders'], 0, ' ', ' ') }}</td>
			</tr>
			<tr>
				<td class="col-md-9">Расходы</td>
				<td class="col-md-3 analytics--number-format">{{ number_format($row['costs'], 0, ' ', ' ') }}</td>
			</tr>
			<tr>
				<td class="col-md-9">Закупка</td>
				<td class="col-md-3 analytics--number-format">{{ number_format($row['supply'], 0, ' ', ' ') }}</td>
			</tr>
			<tr>
				<td class="col-md-9">Продажи</td>
				<td class="col-md-3 analytics--number-format">{{ number_format($row['stock'], 0, ' ', ' ') }}</td>
			</tr>
			@endforeach
			</tbody>
		</table>
	</div>

	<div class="col-md-6">
		<table class="table table-bordered analytics-table">
			<tbody>
				<tr>
					<td class="col-md-9">Закупка за 30 дней</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($sum30DaysSupply, 0, ' ', ' ') }}
					</td>
				</tr>
				<tr>
					<td class="col-md-9">Реализация за 30 дней</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($sum30DaysOrders, 0, ' ', ' ') }}
					</td>
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
				@foreach($sumMonthPoint as $row)
				<tr>
					<td class="col-md-9">Точка {{ $row['point'] }}</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($row['sum'], 0, ' ', ' ') }}
					</td>
				</tr>
				@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format(array_sum(array_column($sumMonthPoint, 'sum')), 0, ' ', ' ') }}
					</td>
				</tr>
			</tbody>
		</table>

		<table class="table table-bordered analytics-table">
			<thead>
				<tr>
					<th colspan="2">Прибыль понедельно (за 30 дней)</th>
				</tr>
			</thead>
			<tbody>
			@foreach($sumWeek as $row)
				<tr>
					<td class="col-md-9">{{ $row['date'] }}</td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format($row['sum'], 0, ' ', ' ') }}
					</td>
				</tr>
			@endforeach
				<tr>
					<td class="col-md-9">Итого: </td>
					<td class="col-md-3 analytics--number-format">
						{{ number_format(array_sum(array_column($sumWeek, 'sum')), 0, ' ', ' ') }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>

</div>
@stop