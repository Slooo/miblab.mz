@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Подробности прихода #{{ $id }}</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<tr>
				<th>Штрихкод</th>
				<th>Наименование</th>
				<th>Цена &#8381; / шт.</th>
				<th>Количество / приход</th>
				<th>Сумма</th>
			</tr>
			@foreach($supply->items as $row)
			<tr>
				<td>{{ $row->barcode }}</td>	
				<td>{{ $row->name }}</td>
				<td>{{ number_format($row->pivot->items_price, 0, ' ', ' ') }}</td>
				<td>{{ $row->pivot->items_quantity }}</td>
				<td>{{ number_format($row->pivot->items_sum, 0, ' ', ' ') }}</td>
			</tr>
			@endforeach
		</table>
	</div>

	<div class="col-md-12">
		<hr>
		<strong>Итого: {{ number_format($supply->sum, 0, ' ', ' ') }} &#8381;</strong><br>
		<strong>Итого со скидкой: {{ number_format($supply->sum_discount, 0, ' ', ' ') }} &#8381;</strong>
	</div>
	
</div>

@stop