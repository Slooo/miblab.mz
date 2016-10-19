{{ Form::open(['id' => 'form_item', 'class' => 'form-horizontal']) }}

{{ Form::hidden('id', null, ['id' => 'item_id']) }}

<div class="form-group">
	{{ Form::label('js-item--barcode', 'Штрихкод', ['class' => 'control-label']) }}
	{{ Form::text('barcode', null, ['class' => 'form-control', 'id' => 'js-item--barcode', 'placeholder' => 'Введите штрихкод']) }}
</div>

<div class="form-group">
	{{ Form::label('name', 'Наименование', ['class' => 'control-label']) }}
	{{ Form::text('name', null, ['class' => 'form-control', 'id' => 'name', 'placeholder' => 'Введите наименование']) }}
</div>

<div class="form-group">
	{{ Form::label('price', 'Цена', ['class' => 'control-label']) }}
	{{ Form::text('price', null, ['class' => 'form-control', 'placeholder' => 'Введите цену']) }}
</div>

<div class="form-group">
	{{ Form::label('price_discount', 'Цена со скидкой', ['class' => 'control-label']) }}
	{{ Form::text('price_discount', null, ['class' => 'form-control', 'placeholder' => 'Введите цену со скидкой']) }}
</div>

<div class="form-group">
	{{ Form::label('quantity', 'Количество', ['class' => 'control-label']) }}
	{{ Form::text('quantity', null, ['class' => 'form-control', 'placeholder' => 'Введите количество']) }}
</div>

<div class="form-group">
	{{ Form::button('Создать', ['id' => 'js-item--sbm', 'class' => 'btn btn-primary']) }}
</div>

{{ Form::close() }}