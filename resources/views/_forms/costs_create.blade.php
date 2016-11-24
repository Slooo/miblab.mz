{{ Form::open(['id' => 'form_costs', 'class' => 'form-horizontal']) }}

<div class="form-group">
	{{ Form::label('sum', 'Сумма', ['class' => 'control-label']) }}
	{{ Form::text('sum', null, ['class' => 'form-control', 'id' => 'sum', 'placeholder' => 'Введите сумму']) }}
</div>

<div class="form-group">
	{{ Form::label('date', 'Дата', ['class' => 'control-label']) }}
	<div class="input-group date" id="datetimepicker">
		{{ Form::text('date', null, ['class' => 'form-control', 'id' => 'date', 'placeholder' => 'Введите дату']) }}
		<span class="input-group-addon">
		 	<span class="glyphicon glyphicon-calendar"></span>
		</span>
	</div>
</div>

<div class="form-group">
	{{ Form::label('point', 'Точка', ['class' => 'control-label']) }}
	<div class="input-group">
		{{ Form::text('point', null, ['class' => 'form-control', 'id' => 'point', 'size' => 2, 'placeholder' => Auth::user()->points_id]) }}
	</div>
</div>

<div class="form-group">
	{{ Form::label('category', 'Категория', ['class' => 'control-label']) }}
	{{ Form::select('ccosts_id', $ccosts, 'S', ['class' => 'form-control', 'id' => 'category']) }}
</div>

<div class="form-group">
	{{ Form::button('Добавить', ['id' => 'js-costs--create', 'class' => 'btn btn-primary']) }}
</div>

{{ Form::close() }}