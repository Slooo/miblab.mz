<!-- 
	
	DATE RANGE 
	
-->

<div class="col-md-12">
	<form url="{{ Request::segment(1).'/'.Request::segment(2).'/date' }}" method="post" id="js-date_range--form">

		<div class="form-group col-md-push-1">
			<div class="input-group date datetimepicker">
				<input type="text" name="date_start" class="form-control input-sm" placeholder="Дата начала">
				<span class="input-group-addon">
				 	<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>

		<div class="form-group col-md-push-1">
			<div class="input-group date datetimepicker">
				<input type="text" name="date_end" class="form-control input-sm" placeholder="Дата конца">
				<span class="input-group-addon">
				 	<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>

		<button type="button" class="btn btn-primary btn-sm" id="js-date_range--sbm">Показать</button>

	</form>
</div>