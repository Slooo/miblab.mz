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
				<button type="button" class="btn btn-default" id="js-item--print-cancel">Отмена</button>
				<button type="button" class="btn btn-primary" id="js-item--print-review" value="">Просмотр</button>
			</div>
		</div>
	</div>
</div>

<div class="full hidden">
	<div class="print"></div>

	<div id="js-item--print-edit">
		<div class="btn-group-vertical">
			<button type="button" class="btn btn-default" data-toggle="modal" data-target="#print-modal">Настройки</button>
			<button type="button" class="btn btn-success" id="js-print">Печать</button>
		</div>
	</div>

</div>

<div class="row">

	<div class="col-md-12">
		<h2>Все товары</h2>
		<hr>
	</div>

	<div class="col-md-12">
		<table class="table table-striped table-bordered">
			<tr>
				<th>Штрихкод</th>
				<th>Наименование</th>
				<th>Цена &#8381; / шт.</th>
				<th>Количество</th>
				<th>Статус</th>
				<th>Печать</th>
			</tr>
			@foreach($items as $row)
			<tr item="{{ $row->id }}">
				<td>{{ $row->barcode }}</td>
				<td data-type="name">{{ $row->name }}</td>
				<td class="js-item--update" data-type="price">{{ $row->price }}</td>
				<td class="js-item--update" data-type="quantity">{{ $row->quantity }}</td>
				<td>
				@if($row->status == 1)
					<button class="btn js-item--status btn-circle btn-success" data-id="{{ $row->id }}" data-status="1"><i class="fa fa-check"></i></button>
				@elseif($row->type == 0)
					<button class="btn js-item--status btn-circle btn-danger" data-id="{{ $row->id }}" data-status="0"><i class="fa fa-ban" aria-hidden="true"></i></button>
				@endif
				</td>

				<td><button type="button" data-barcode="{{ $row->barcode }}" class="btn btn-circle btn-primary js-item--print-review"><i class="fa fa-print" aria-hidden="true"></i></button></td>
			</tr>
			@endforeach
		</table>
	</div>
	
</div>

@stop

@section('script')

	<style>
		@media print {
		  body  * {
		    visibility: hidden;
		  }
		  .print * {
		    visibility: visible;
		  }
		}

		.box {
			float: left;
			padding:10px;
			width: 4,5cm;
			height: 2,5cm;
			margin: 2%;
			border:1px solid #333;
			border-radius:8px;
		}

		.box .header {
			margin-top:10px;
			text-align:center;
		}

		.box .barcode{
			text-align:center;
			margin-bottom:20px;
		}

		.box .barcode span {
			position:absolute;
			margin-top:-7px;
			margin-left:-100px;
			letter-spacing:10px;
		}

		.box .description {
			border-top:1px solid #333;
			border-bottom:1px solid #333;
			height:22px;
		}

		.box .description span {
			float:left;
			width:35%;
			margin-right:13%;
			padding-right:1%;
			border-right:1px solid #333;
		}

		.box .description time {
			float:right;
			width:35%;
			margin-left:13%;
			padding-left:1%;
			border-left:1px solid #333;
		}

		.box .title {
			width:100%;
			text-align:left;
			padding:5px 0px 5px 0px;
		}

		.box .footer p {
			float:left;
			width:40%;
			text-align:left;
		}

		.box .footer span {
			float:right;
			width:60%;
			text-align:left;
			border-bottom:1px solid #333;
		}

		#js-item--print-edit {
			position:fixed;
			right:30px;
		}

		#print_frame{
		    display: none;
		}

		.full {
    		box-shadow: 0 0 10px #333;
    	}

		#print-modal {
			text-align: center;
		}

		.modal-body .form-group {
			margin-bottom:0px;
		}
	</style>
@stop