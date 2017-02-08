<!-- 

	COSTS CREATE MODAL FORM 

-->

<form role="form" class="form-horizontal" id="js-costs--form">

	<div class="form-group">
		<input type="number" name="sum" placeholder="Введите сумму" class="form-control col-sm-10"> 
	</div>
	
	<div class="form-group">
		<div class="input-group date datetimepicker">
			<input type="text" name="date" placeholder="Выберите дату" class="form-control col-sm-10"> 
			<span class="input-group-addon">
			 	<span class="glyphicon glyphicon-calendar"></span>
			</span>
		</div>
	</div>
	
	<div class="form-group">
		<input type="text" name="points_id" value="{{ Auth::user()->points_id }}" size="2" placeholder="Торговая точка #{{ Auth::user()->points_id }}" class="form-control col-sm-10">
	</div>
		
	<div class="form-group">
		<button type="button" class="btn btn-primary" id="js-costs--create">Создать</button>
	</div>

</form>

<style>
	.input-group {
		margin-bottom:10px;
	}
</style>