<form id="js-form--items" class="form-horizontal" role="form">

	<input name="id" type="hidden" id="item_id">

	<div class="form-group">
		<input class="form-control col-sm-10" name="barcode" type="number" placeholder="Введите штрихкод"> 
	</div>

	<div class="form-group">
		<input class="form-control col-sm-10" name="name" type="text" placeholder="Введите наименование">
	</div>

	<div class="form-group">
		<input class="form-control col-sm-10" name="price" type="number" placeholder="Введите цену">
	</div>	

	<div class="form-group">
		<input class="form-control col-sm-10" name="price_discount" type="number" placeholder="Цена со скидкой">
	</div>	

	<div class="form-group">
		<input class="form-control col-sm-10" name="quantity" type="number" placeholder="Введите количество">
	</div>

	<div class="form-group">
		<button type="button" class="btn btn-primary" id="js-items--create">Создать</button>
	</div>

</form>