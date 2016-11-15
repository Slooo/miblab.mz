@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Настройки скидок</h2>
		<hr>
	</div>
	
	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">
		<table class="table table-striped table-bordered">
			<thead>
				<tr>
					<th>Сумма</th>
					<th>Процент</th>
				</tr>
			</thead>
	
			<tbody>
			@foreach($discount as $key => $row)
				<tr data-id="{{ $key }}">
					<td class="js-discount--sum js-discount--update">{{ $row['sum'] }}</td>
					<td class="js-discount--percent js-discount--update">{{ $row['percent'] }}</td>
				</tr>
			@endforeach
			</tbody>
		</table>
	</div>

</div>

@stop

@section('script')
<script>

// select update item order
$(document).on('click', '.js-discount--update', function(){
	var here, data;
	
	here = $(this);
	data = here.text();

	here.html('<input type="text" id="js-discount--update" placeholder="'+data+'">');

	$("#js-discount--update").numeric();
	here.find('input').focus();
});

// update discount
function DiscountUpdate(here){
	var here, id, key, data, json;

	id 	 = here.parents('tr').data('id');

	if(here.parent('td').hasClass('js-discount--sum'))
	{
		key = 'sum';
	} else {
		key = 'percent';
	}

	data = {"id":id, "key":key, "value":Number(here.val())};

	$.ajax({
		url 	 : base_url + segment1 + 'discount',
		type 	 : 'patch',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 0)
			{
				AnswerError();
			}

			if(answer.status == 1)
			{
				$('.order').removeClass('hidden');
				$('#alert').removeClass().html('');

				here.parent('td').html(here.val());		

			}
	    },

	    error: function(answer) {
	    	AnswerError();
	    }

	}).complete(function() {
			LoaderStop();
		});
}

// update discount focusout
$(document).on('focusout', '#js-discount--update', function(){
	DiscountUpdate($(this));
});

// update discount press enter
$(document).on('keypress', '#js-discount--update', function(e){
	if(e.which == 13) {
		DiscountUpdate($(this));
	}
});
	
	</script>
@stop