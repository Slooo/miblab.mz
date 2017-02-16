<!-- 

	Index supply page

-->

@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Приходы</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">
	@if(count($supply) > 0)
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>№ прихода</th>
					<th>Дата</th>
					<th>Сумма &#8381;</th>
				</tr>
			</thead>
			
			<tbody data-type="main">
				@foreach($supply as $row)
				<tr data-id="{{ $row->id }}">
					<td class="col-md-1 js--url-link" data-url="{{ url(Request::segment(1).'/'.Request::segment(2).'/'.$row->id) }}">
						{{ $row->id }}
					</td>
					<td class="col-md-2">
						{{ $row->date_format }}
					</td>
					<td class="col-md-9 js--totalSum">
						{{ number_format($totalSum[] = $row->sum, 0, ' ', ' ') }}
					</td>
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
		<h2>Нет приходов</h2>
		</div>
	@endif
	
</div>

@stop