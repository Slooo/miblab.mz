@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Внесенные расходы: "{{ $ccosts->name }}"</h2>
		<hr>
	</div>

	<div class="col-md-12">
	@if(count($ccosts->costs) > 0)
		<table class="table table-bordered table-striped">
			<tr>
				<th>Дата</th>
				<th>Сумма &#8381;</th>
			</tr>

			@foreach($ccosts->costs as $row)
			<tr>
				<td>{{ $row->date }}</td>
				<td>{{ $row->sum }}</td>
			</tr>
			@endforeach
		</table>
	@else
		<h2>Нет расходов</h2>
	@endif
	</div>

</div>

@stop