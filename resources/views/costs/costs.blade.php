@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Внесенные расходы: "{{ $ccosts }}"</h2>
		<hr>
	</div>

	<div class="col-md-12 col-body">
	@if(count($costs) > 0)
		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>№</th>
					<th>Дата</th>
					<th>Сумма &#8381;</th>
					<th>Удалить</th>
				</tr>
			</thead>
			<tbody>
				@foreach($costs as $row)
				<tr data-id="{{ $row->id }}" data-type="pivot">
					<td class="col-md-1">{{ $row->id }}</td>
					<td class="col-md-1" data-column="date">{{ $row->date_format }}</td>
					<td class="col-md-9 js--update js--sum" data-column="sum">{{ number_format($totalSum[] = $row->sum, 0, ' ', ' ') }}</td>
					<td class="col-md-1"><button class="btn btn-circle btn-danger js--delete"><li class="fa fa-remove"></li></button></td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>

	<div class="col-md-12 col-footer">
		<hr>
		<strong class="totalSum">Итого: {{ number_format(array_sum($totalSum), 0, ' ', ' ') }} &#8381;</strong>
		<hr>
	</div>

	@else
		<h2>Нет расходов</h2>
		</div>
	@endif

</div>

@stop