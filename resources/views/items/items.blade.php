<!-- 

	Items page 

-->

@extends('app')

@section('content')

<div class="modal fade" id="print-modal" tabindex="-1" role="dialog" aria-labelledby="print-modal">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="print-modal">Печать штрихкода<br><strong></strong></h4>
			</div>
			<div class="modal-body">
				<form role="form">
					<div class="form-group">
						<input type="text" class="form-control" id="print-quantity" value="" placeholder="Количество копий">
					</div>
			</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" id="js-items--print-cancel">Отмена</button>
				<button type="button" class="btn btn-primary" id="js-items--print-review" value="">Просмотр</button>
			</div>
		</div>
	</div>
</div>

<div class="full hidden">
	<div class="print"></div>

	<div id="js-items--print-edit">
		<div class="btn-group-vertical">
			<button type="button" class="btn btn-default" data-toggle="modal" data-target="#print-modal">Настройки</button>
			<button type="button" class="btn btn-success" id="js--items-print">Печать</button>
		</div>
	</div>

</div>

<div class="row">

	<div class="col-md-12">
		<h2>Справочник товаров</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>Штрихкод</th>
					<th>Наименование</th>
					<th>Цена &#8381; / шт.</th>
					<th>Статус</th>
				</tr>
			</thead>
			<tbody data-type="pivot">
				@foreach($items as $row)
				<tr data-id="{{ $row->id }}">
					<td>{{ $row->barcode }}</td>
					<td>{{ $row->name }}</td>
					<td class="js--update" data-column="price">{{ number_format($row->price, 0, ' ', ' ') }}</td>
					<td>
					@if($row->status == 1)
						<button class="btn btn-circle btn-success" data-status="1">
							<i class="fa fa-check"></i>
						</button>
					@else
						<button class="btn btn-circle btn-danger" data-status="0">
							<i class="fa fa-ban"></i>
						</button>
					@endif
					</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
	
</div>

@stop