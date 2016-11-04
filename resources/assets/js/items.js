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
	here.find('input').numeric().focus();
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
			url:     base_url + segment1 + 'items/search',
			type:     "PATCH",
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
		url = base_url + segment1 + segment2;
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
		url 	 : base_url + segment1+ 'items/barcode/generate',
		type 	 : 'PATCH',
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

/*
	------- CASHIER FUNCTION ------- 
*/

// type order
$('body').on('click', '.js-order--type', function(e){
	var btn = $(this);
	var type = Number(btn.val());

	if(localStorage){
		localStorage['order-type-index'] = $(this).index();
	}

	var json = JSON.parse(localStorage.getItem('items'));
	json.type = type;
	localStorage.setItem('items', JSON.stringify(json));
	OrderTypeActive(btn);
});

// search item
$('#js-item--search').keyup(function(e){
	e.preventDefault();
	var barcode = $(this).val();
	var data = {'barcode':barcode}

	if(barcode.length > 10)
	{
		$.ajax({
			url:      base_url + segment1 + 'items/search',
			type:     'PATCH',
			dataType: 'json',
			data:     data,

			beforeSend: function(){
		        LoaderStart();
		    },

			success: function(answer) {
				if(answer.status == 0)
				{
					AnswerError('<button id="js-item--barcode-create" class="btn btn-danger">Отправить штрихкод</button>');
				}

				if(answer.status == 1)
				{
					$('.order').removeClass('hidden');
					$('#alert').removeClass().html('');
					var data = JSON.stringify(answer.items);
					var json = JSON.parse(data);
					OrderItemPaste(json);
				}
		    },

		    error: function(answer) {
		    	AnswerError('Введите штрихкод');
		    }

		}).complete(function() {
				LoaderStop();
			});
	}
});

// select update item order
$(document).on('click', '.js-order--update', function(){
	var here = $(this);
	var data = here.text();
	here.html('<input type="text" id="js-order--update" placeholder="'+data+'">');
	$("#js-order--update").numeric();
	here.find('input').focus();
});

// update item press enter
$(document).on('keypress', '#js-order--update', function(e){
	if(e.which == 13) {
		OrderUpdate($(this));
	}
});

// update item focusout
$(document).on('focusout', '#js-order--update', function(){
	OrderUpdate($(this));
});

// delete item order
$('body').on("click", ".js-order--remove", function(){
	var parents  = $(this).parents('tr');
	var item  	 = parents.data('item');
	var price 	 = parents.find('.js-order--price').val();
	var quantity = parents.find('.js-order--quantity').val();
	var count 	 = $('.order-table tbody tr').length;
	var json 	 = JSON.parse(localStorage.getItem('items'));

	var index = json.items.findIndex(function(array, i){
	   	return array.item === item
	});

	json.items.splice(index, 1);
	localStorage.setItem('items', JSON.stringify(json));

	parents.remove();

	if(count == 1)
	{
		OrderClear();
	} else {
		localStorage.setItem('order-table', $('.order-table').html());
		OrderTotalPrice();
	}
});

// create new item (cashier -> admin)
$('body').on('click', '#js-item--barcode-create', function(e){
	e.preventDefault();

	var barcode = $('#item-search').val();
	var data = {'barcode':barcode}

	$.ajax({
		url:     'cashier/barcode',
		type:     "POST",
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
				AnswerSuccess(answer.message);
			}

	    },

	    error: function(answer) {
	    	AnswerSuccess('Ошибка');
	    }

	}).complete(function() {
	        LoaderStop();
		});
});