@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Система скидок</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>№</th>
					<th>Сумма</th>
					<th>Процент</th>
					<th>Опции</th>
				</tr>
			</thead>
	
			<tbody>
			@foreach($discounts as $row)
				<tr data-id="{{ $row->id }}" data-type="main">
					<td class="col-md-1">{{ $row->id }}</td>
					<td class="col-md-5 js--sum js--update" data-column="sum">{{ number_format($row->sum, 0, ' ', ' ') }}</td>
					<td class="col-md-5 js--percent js--update" data-column="percent">{{ $row->percent }}</td>
					<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>
				</tr>
			@endforeach
			</tbody>
		</table>

	</div>

</div>

@stop