@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Последние заказы</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1">
	@if(count($orders) > 0)
		<table class="table table-striped table-bordered">
			<tr>
				<th>№ заказа</th>
				<th>Дата</th>
				<th>Сумма &#8381;</th>
				<th>Сумма со скидкой &#8381;</th>
				<th>Тип оплаты</th>
			</tr>			
			
			@foreach($orders as $row)
			<tr>
				<td class="js-order--url" data-url="{{ url(Request::segment(1).'/order/'.$row->id) }}">{{ $row->id }}</td>
				<td>{{ $row->pivot->date_format }}</td>
				<td>{{ number_format($totalSum[] = $row->sum, 0, ' ', ' ') }}</td>
				<td>{{ number_format($totalSumDiscount[] = $row->sum_discount, 0, ' ', ' ') }}</td>
				<td>{{ ($row->type == 1 ? 'Налично' : 'Безналично') }}</td>
			</tr>
			@endforeach
		</table>
	</div>

	<div class="col-md-12">
		<hr>
		<strong>Итого: {{ number_format(array_sum($totalSum), 0, ' ', ' ') }} &#8381;</strong><br>
		<strong>Итого со скидкой: {{ number_format(array_sum($totalSumDiscount), 0, ' ', ' ') }} &#8381;</strong>
	</div>

	@else
		<h2>Нет заказов</h2>
		</div>
	@endif
	
</div>

@stop

@section('script')
<script>
/*
$('#js-order--date-range').click(function(e){
	e.preventDefault();

	var date_start = $('#date_start').val();
	var date_end = $('#date_end').val();
	data = {'date_start':date_start, 'date_end':date_end};

	$.ajax({
		url:     '/admin/orders/date',
		type:     "PATCH",
		dataType: "json",
		data: data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {

			if(answer.status == 0)
			{
			}

			if(answer.status == 1)
			{
				var html = "";

				var data = JSON.stringify(answer.items);
				var json = JSON.parse(data);

				for(post in json)
				{
					html+=post[json.sum];
				}
				console.log(html);
			}

	    }
	}).complete(function() {
	    LoaderStop();
	});
});
*/
</script>
@stop