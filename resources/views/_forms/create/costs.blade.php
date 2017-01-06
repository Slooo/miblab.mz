<!-- COSTS CREATE MODAL FORM -->

<form id="js-form--costs" class="form-horizontal" role="form">

	<div class="form-group">
		<input class="form-control col-sm-10" name="sum" type="number" placeholder="Введите сумму"> 
	</div>
	
	<div class="form-group">
		<div class="input-group date" id="datetimepicker">
			<input class="form-control col-sm-10" name="date" type="text" placeholder="Выберите дату"> 
			<span class="input-group-addon">
			 	<span class="glyphicon glyphicon-calendar"></span>
			</span>
		</div>
	</div>
	
	<div class="form-group">
		<input type="text" name="point" class="form-control col-sm-10" size="2" placeholder="Торговая точка #{{ Auth::user()->points_id }}">
	</div>
	
	<input type="hidden" name="ccosts_id" value="{{ Request::segment(3) }}">
	
	<div class="form-group">
		<button type="button" class="btn btn-primary" id="js-costs--create">Создать</button>
	</div>

</form>

<style>
	.input-group {
		margin-bottom:10px;
	}
</style>