<!-- 

	Items orders page 

-->

@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Подробности заказа #{{ $id }}</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>Штрихкод</th>
					<th>Наименование</th>
					<th>Цена &#8381; / шт.</th>
					<th>Количество / уход</th>
					<th>Сумма</th>
				</tr>
			</thead>
			<tbody data-type="pivot">
				@foreach($order->items as $row)
				<tr data-id="{{ $row->pivot->id }}">
					<td class="col-md-2">{{ $row->barcode }}</td>	
					<td class="col-md-4">{{ $row->name }}</td>
					<td class="col-md-2">{{ number_format($row->pivot->items_price, 0, ' ', ' ') }}</td>
					<td class="col-md-1">{{ $row->pivot->items_quantity }}</td>
					<td class="col-md-2">{{ number_format($row->pivot->items_sum, 0, ' ', ' ') }}</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>

	<div class="col-md-12">
		<hr>
		<strong>Итого: {{ number_format($order->sum, 0, ' ', ' ') }} &#8381;</strong><br>
		<strong>Итого со скидкой: {{ number_format($order->sum_discount, 0, ' ', ' ') }} &#8381;</strong>
		<hr>
	</div>
	
</div>

@stop