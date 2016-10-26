@extends('app')

@section('content')

<script>
$(document).ready(function(){
	$('#js-item--search').focus();
});
</script>

<div class="row">

	<div class="col-md-8 col-md-offset-4">
		{{ Form::text('barcode', null, ['id' => 'js-item--search', 'class' => 'form-search', 'placeholder' => 'введите штрихкод...']) }}
	</div>

	<!-- Order items -->
	<div class="col-md-12 order">
		<hr>
		<div class="order-table">
			<table class="table table-striped table-bordered">
				<thead>
					<th>Штрихкод</th>
					<th>Наименование</th>
					<th>Цена ₽ / шт.</th>
					<th>Количество</th>
					<th colspan="2">Сумма</th>
				</thead>
				<tbody>
					
				</tbody>
			</table>
		</div>
		<hr>

		<div class="col-md-12">
			<div class="btn-group">
				<button class="btn btn-default js-order--type" value="1">Налично</button>
				<button class="btn btn-default js-order--type" value="0">Безналично</button>
			</div>
		</div>
			<div class="col-md-12">
				<hr>
				<strong>Итого: </strong><span id="order-sum"></span>
				<br>
				<strong>Итого со скидкой: </strong><span id="order-sumDiscount"></span>
				<hr>
			</div>

		<div class="col-md-12">
			<button class="btn btn-primary" 
			id="js-{{ $url = (Request::segment(1) == 'admin' ? 'supply' : 'order') }}--create">Создать</button>
			<hr>
		</div>
	</div>

</div>

@stop

@section('script')
	<script>
		CashierPageLoad()
	</script>
@stop