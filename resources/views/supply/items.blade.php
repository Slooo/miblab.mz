<!-- 

	Items supply page

-->

@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Подробности прихода #{{ $id }}</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>Штрихкод</th>
					<th>Наименование</th>
					<th>Цена &#8381; / шт.</th>
					<th>Количество / приход</th>
					<th>Сумма</th>
					<th>Удалить</th>
				</tr>
			</thead>

			<tbody data-type="pivot">
				@foreach($supply->items as $row)
				<tr data-id="{{ $row->pivot->id }}">
					<td class="col-md-1">
						{{ $row->barcode }}
					</td>	
					<td class="col-md-4">
						{{ $row->name }}
					</td>
					<td class="col-md-2 js--update" data-column="items_price">
						{{ number_format($row->pivot->items_price, 0, ' ', ' ') }}
					</td>
					<td class="col-md-2 js--update" data-column="items_quantity">
						{{ $row->pivot->items_quantity }}
					</td>
					<td class="col-md-2 js--totalSum">
						{{ number_format($row->pivot->items_sum, 0, ' ', ' ') }}
					</td>
					<td class="col-md-1">
						<button class="btn btn-circle btn-danger js--delete"><i class="fa fa-remove"></i></button>
					</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>

	<div class="col-md-12 col-footer">
		<hr>
		<strong class="totalSum">Итого: {{ number_format($supply->sum, 0, ' ', ' ') }} &#8381;</strong>
		<hr>
	</div>

</div>

@stop