<!-- DATE RANGE -->

<div class="col-md-12">
	<form id="form_item" url="{{ Request::segment(1).'/'.Request::segment(2).'/date' }}" method="post">

		<div class="form-group col-md-push-1">
			<div class="input-group date" id="datetimepicker">
				<input type="text" name="date_start" class="form-control input-sm" id="date_start" placeholder="Дата начала">
				<span class="input-group-addon">
				 	<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>

		<div class="form-group col-md-push-1">
			<div class="input-group date" id="datetimepicker2">
				<input type="text" name="date_end" class="form-control input-sm" id="date_end" placeholder="Дата конца">
				<span class="input-group-addon">
				 	<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>

		<input type="hidden" name="id" value="{{ Request::segment(3) }}">

		<button type="button" class="btn btn-primary btn-sm" id="js-settings--date-range">Показать</button>

	</form>
</div>