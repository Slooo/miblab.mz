@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12">
		<h2>Внесенные расходы: "{{ $ccosts }}"</h2>
		<hr>
	</div>

	<div class="col-md-12">
	@if(count($costs) > 0)
		<table class="table table-bordered table-striped">
			<tr>
				<th>Дата</th>
				<th>Сумма &#8381;</th>
			</tr>

			@foreach($costs as $row)
			<tr>
				<td>{{ $row->date_format }}</td>
				<td>{{ number_format($totalSum[] = $row->sum, 0, ' ', ' ') }}</td>
			</tr>
			@endforeach
		</table>

	</div>

	<div class="col-md-12">
		<hr>
		<strong>Итого: {{ number_format(array_sum($totalSum), 0, ' ', ' ') }} &#8381;</strong><br>
	</div>

	@else
		<h2>Нет расходов</h2>
		</div>
	@endif

</div>

@stop