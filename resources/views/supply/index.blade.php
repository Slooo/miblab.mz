@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Приход</h2>
		<hr>
	</div>

	<div class="col-md-12">
		@if(count($supply) > 0)
			<table class="table table-striped table-bordered">
				<tr>
					<th>Дата</th>
					<th>Наименование</th>
					<th>Штрихкод</th>
					<th>Цена</th>
					<th>Цена со скидкой</th>
					<th>Количество</th>
				</tr>
				@foreach($supply as $row)
				<tr>
					<td>{{ $row->date_format }}</td>
					<td>{{ $row->name }}</td>
					<td>{{ $row->barcode }}</td>
					<td>{{ number_format($row->price, 0, ' ', ' ') }}</td>
					<td>{{ number_format($row->price_discount, 0, ' ', ' ') }}</td>
					<td>{{ $row->quantity }}</td>
				</tr>
				@endforeach
			</table>
		@else
			<h2>Нет приходов за период</h2>	
		@endif
	</div>

</div>

@stop