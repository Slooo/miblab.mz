<div class="col-md-12">
{{ Form::open(['id' => 'form_item', 'url' => Request::segment(1).'/'.Request::segment(2).'/date', 'method' => 'post']) }}

	{{ Form::hidden('id', Request::segment(3)) }}

	<div class="form-group col-md-push-1">
		<div class="input-group date" id="datetimepicker">
			{{ Form::text('date_start', null, ['class' => 'form-control input-sm', 'id' => 'date_start', 'placeholder' => 'Дата начала']) }}
			<span class="input-group-addon">
			 	<span class="glyphicon glyphicon-calendar"></span>
			</span>
		</div>
	</div>

	<div class="form-group col-md-push-1">
		<div class="input-group date" id="datetimepicker2">
			{{ Form::text('date_end', null, ['class' => 'form-control input-sm', 'id' => 'date_end', 'placeholder' => 'Дата конца']) }}
			<span class="input-group-addon">
			 	<span class="glyphicon glyphicon-calendar"></span>
			</span>
		</div>
	</div>

	<button type="button" class="btn btn-primary btn-sm" id="js-settings--date-range">Показать</button>

{{ Form::close() }}
</div>