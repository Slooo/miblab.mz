{{ Form::open(['id' => 'form_costs', 'class' => 'form-horizontal']) }}

<div class="form-group">
	{{ Form::label('price', 'Сумма', ['class' => 'control-label']) }}
	{{ Form::text('price', null, ['class' => 'form-control', 'id' => 'price', 'placeholder' => 'Введите сумму']) }}
</div>

<div class="form-group">
	{{ Form::label('added_at', 'Дата', ['class' => 'control-label']) }}
	<div class="input-group date" id="datetimepicker">
		{{ Form::text('added_at', null, ['class' => 'form-control', 'id' => 'added_at', 'placeholder' => 'Введите дату']) }}
		<span class="input-group-addon">
		 	<span class="glyphicon glyphicon-calendar"></span>
		</span>
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