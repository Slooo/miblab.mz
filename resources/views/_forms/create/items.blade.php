<!-- ITEMS CREATE MODAL FORM -->

<form id="js-items--form" class="form-horizontal" role="form">

	<input type="hidden"  name="id" id="items_id">

	<input type="hidden" name="status" value="1">

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
		<button type="button" class="btn btn-primary" id="js-items--create">Создать</button>
	</div>

</form>