/*
	------- ITEMS FUNCTION ------- 
*/

// update price item
$('.js-item--update').on('click', function(){
	var here = $(this);
	var data = here.text();
	var type = here.data('type');
	here.html('<input type="text" data-type="'+type+'" value="'+data+'">');
	here.attr('id', 'js-item--update');
	here.find('input').focus();
});

// update item
$(document).on('focusout', 'td#js-item--update input', function(){
	var here = $(this);
	var id = here.parents('tr').attr('item');
	var value = here.val();
	var type = here.data('type');

	var data = {};
	data[type] = value;

	$.ajax({
		url:     'items/' + id,
		type:     "PATCH",
		dataType: "json",
		data: data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {

			if(answer.status == 0)
			{
				AnswerError(answer.message);
			}

			if(answer.status == 1)
			{
				here.parent('td').removeAttr('id').html(value);
				AnswerSuccess(answer.message);
			}

	    }
	}).complete(function() {
	    LoaderStop();
	});
});

// update status
$('body').on('click', '.js-item--status', function(e){
	e.preventDefault();
	var btn = $(this);
	var status = btn.attr('data-status');
	var id = btn.attr('data-id');
	var data = {'id':id, 'status':status}

	$.ajax({
		url:     'items/status',
		type:     "PATCH",
		dataType: "json",
		data: data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {

			if(answer.status == 0)
			{
				btn.removeClass('btn-success').addClass('btn-danger');
				btn.html('<i class="fa fa-ban"></i>');
				btn.attr('data-status', answer.status);
			}

			if(answer.status == 1)
			{
				btn.removeClass('btn-danger').addClass('btn-success');
				btn.html('<i class="fa fa-check"></i>');
				btn.attr('data-status', answer.status);
			}

	    }
	}).complete(function() {
	    LoaderStop();
	});
});

// search item
$('#js-item--barcode').focusout(function() {
	var barcode = $(this).val();
	var data = {'barcode':barcode}

	if(barcode)
	{
		$.ajax({
			url:     'search',
			type:     "POST",
			dataType: "json",
			data: data,

			beforeSend: function(){
	        	LoaderStart();
		    },

			success: function(answer) {
				if(answer.status == 0)
				{
					$('#item_id, #name, #price, #quantity').val('');
					$('#js-item--sbm').text('Создать');
					AnswerInfo('<strong>'+answer.message+'</strong>. Будет создан новый');
				}

				if(answer.status == 1)
				{
					var json = JSON.stringify(answer.items);
					var item = JSON.parse(json);

					$('#item_id').val(item.id);
					$('#name').val(item.name);
					$('#price').val(item.price);
					$('#quantity').val(item.quantity);
					$('#js-item--sbm').text('Обновить');
					AnswerWarning('<strong>'+answer.message+'</strong>. Будет обновлен');
				}
		    }

		}).complete(function() {
	        LoaderStop();
		});
	}
});

// create & update item
$('body').on('click', '#js-item--sbm', function(e){
	e.preventDefault();
	var data = $('#form_item').serialize();
	var id = $('#item_id').val();

	if(id == 0)
	{
		//create
		url = base_url + 'items';
		type = "POST";

	} else {
		//update
		url = id;
		type = "PATCH";
	}

	$.ajax({
		url:      url,
		type:     type,
		dataType: "json",
		data: 	  data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {

			if(answer.status == 0)
			{
				AnswerError('<strong>'+answer.message+'</strong>');
			}

			if(answer.status == 1)
			{
				AnswerInfo('<strong>'+answer.message+'</strong>');
			}

	    },

	    error: function(answer) {
	    	AnswerError('<strong>Ошибка!</strong> Заполните поля');
	    }

	}).complete(function() {
	        LoaderStop();
		});

});

// select barcode
$('body').on('click', '.js-item--print-review', function(e){
	e.preventDefault();
	var barcode = $(this).data('barcode');
	$('#print-modal strong').html(barcode);
	$('#js-item--print-review').val(barcode);
	$('#print-modal').modal('show');
});

// open modal barcode review
$('#print-modal').on('shown.bs.modal', function () {
    $('#print-quantity').numeric({decimal: false, negative: false}).focus();
});

// if qty = 0 return 1
$('#print-quantity').keyup(function(){
	if($(this).val() == '0'){
		$(this).val(1);
	}
});

// close modal & clear review
$('#js-item--print-cancel').click(function(e){
	$('.full').addClass('hidden');
	$('.row').removeClass('hidden');
	$('#print-modal').modal('hide');
});

// generate barcode
$('#js-item--print-review').click(function(e){
	$('#print-modal').modal('hide');
	$('.row').addClass('hidden');
	var html = "";
	var barcode = $('#js-item--print-review').val();
	var quantity = $('#print-quantity').val();
	var data = {'barcode':barcode};

	$.ajax({
		url 	 : base_url + 'items/barcode/generate',
		type 	 : 'POST',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				var json = JSON.stringify(answer.item);
				var item = JSON.parse(json);
				for (i = 0; i < quantity; i++) {
					html += '<div class="box">';
					html += '<div class="header">ИП Зибарева С.С.</div>';
					html += '<div class="description"><span>'+item.barcode+'</span><time>'+answer.time+'</time></div>';
					html += '<div class="title">'+item.name+'</div>';
					html += '<div class="barcode">'+answer.barcode+'<br>';
					html += '<span>'+item.barcode+'</span></div>';
					html += '<div class="footer"><p>'+item.price+'</p>';
					html += '<span>руб. за шт.</span>';
					html += '</div></div>';
				}

				$('.full').removeClass('hidden');
				$('.print').html(html);
			}
	    },

	    error: function(answer) {
	    	AnswerError('Укажите тип оплаты');
		}

	}).complete(function() {
	        LoaderStop();
		});
});

// print
$('body').on('click', '#js-print', function(e){
	e.preventDefault();
	window.print();
});