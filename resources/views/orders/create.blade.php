<!-- 

	Create orders page 

-->

@extends('app')

@section('content')

<script>
$(document).ready(function(){
	$('#js-item--search').focus();
});
</script>

<div class="row">

	<div class="col-md-8 col-md-offset-4">
		<input type="number" name="barcode" id="js-items--search" class="form-search" min="10" placeholder="Введите штрихкод...">
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
					<th>Сумма</th>
				</thead>
				<tbody>
					
				</tbody>
			</table>
		</div>
		<hr>

		@if(Request::is('*/orders/create'))
		<div class="col-md-12">
			<div class="btn-group">
				<button class="btn btn-default js-order--type" value="1">Налично</button>
				<button class="btn btn-default js-order--type" value="0">Безналично</button>
			</div>
		</div>

		<div class="col-md-12">
		<hr>
			<div class="btn-group">
				<button class="btn btn-default js-order--discount">Скидка 5%</button>
			</div>
		</div>
		@endif

		@if(Request::is('*/supply/create'))
		<div class="col-md-12">
			<hr>
				<select class="js-supply--counterparty">
					<option selected="selected" disabled="disabled">Контрагент</option>
				@foreach($counterparty as $row)
					<option value={{ $row->id }}>{{ $row->name }}</option>
				@endforeach
				</select>
			</div>
		@endif

		<div class="col-md-12">
			<hr>
			<strong>Итого: </strong><span id="order-sum"></span>
			<hr>
		</div>

		<div class="col-md-12">
			<button class="btn btn-primary" id="js-orders-supply--create">Создать</button>
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