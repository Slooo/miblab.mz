@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Заказы</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">
	@if(count($orders) > 0)
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>№ заказа</th>
					<th>Дата</th>
					<th>Сумма &#8381;</th>
					<th>Сумма со скидкой &#8381;</th>
					<th>Тип оплаты</th>
				</tr>
			</thead>	
			
			<tbody>
				@foreach($orders as $row)
				<tr>
					<td class="js-url--link" data-url="{{ url(Request::segment(1).'/'.Request::segment(2).'/'.$row->id) }}">{{ $row->id }}</td>
					<td>{{ $row->date_format }}</td>
					<td>{{ number_format($totalSum[] = $row->sum, 0, ' ', ' ') }}</td>
					<td>{{ number_format($totalSumDiscount[] = $row->sum_discount, 0, ' ', ' ') }}</td>
					<td>{{ ($row->type == 1 ? 'Налично' : 'Безналично') }}</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>

	<div class="col-md-12 col-footer">
		<hr>
		<strong class="totalSum">Итого: {{ number_format(array_sum($totalSum), 0, ' ', ' ') }} &#8381;</strong><br>
		<strong class="totalSumDiscount">Итого со скидкой: {{ number_format(array_sum($totalSumDiscount), 0, ' ', ' ') }} &#8381;</strong>
		<hr>
	</div>

	@else
		<h2>Нет заказов</h2>
		</div>
	@endif
	
</div>

@stop