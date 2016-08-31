@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Последние заказы</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1">
		<table class="table table-striped table-bordered">
			<tr>
				<th>№ заказа</th>
				<th>Дата</th>
				<th>Сумма &#8381;</th>
				<th>Тип оплаты</th>
			</tr>
			
			@foreach($orders as $row)
			<tr>
				<td class="js-order--url" data-url="{{ url('order/'.$row->id) }}">{{ $row->id }}</td>
				<td>{{ $row->created_at }}</td>
				<td>{{ $row->price }}</td>
				<td>
				@if($row->type == 1)
					Налично
				@elseif($row->type == 0)
					Безналично
				@endif
				</td>
			</tr>
			@endforeach
		</table>
	</div>
	
</div>

@stop