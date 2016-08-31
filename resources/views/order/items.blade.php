@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Подробности заказа #{{ $id }}</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<tr>
				<th>Штрихкод</th>
				<th>Наименование</th>
				<th>Цена &#8381; / шт.</th>
				<th>Количество / уход</th>
				<th>Сумма</th>

			</tr>
			@foreach($order->items as $row)
			<tr>	
				<td>{{ $row->barcode }}</td>	
				<td>{{ $row->name }}</td>
				<td>{{ $row->pivot->items_price }}</td>
				<td>{{ $row->pivot->items_quantity }}</td>
				<td>{{ $row->pivot->items_sum }}</td>
			</tr>
			@endforeach
		</table>
	</div>

	<div class="col-md-12">
		<hr>
		<strong>Итого: {{ $order->price }} &#8381;</strong>
	</div>
	
</div>

@stop