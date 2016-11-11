/*
	------- ITEMS FUNCTION ------- 
*/

// update status
$('body').on('click', '.js-item--status', function(e){
	e.preventDefault();

	var btn, status, id, data;

	btn    = $(this);
	status = btn.attr('data-status');
	id 	   = btn.attr('data-id');
	data   = {'id':id, 'status':status}

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'status',
		type 	 : "patch",
		dataType : "json",
		data 	 : data,

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
	    },

	    error: function(answer) {
	    	AnswerError();
	    }

	}).complete(function() {
	    LoaderStop();
	});
});

// search item
$('#js-item--barcode').focusout(function() {

	var barcode, data, json, item;

	barcode = $(this).val();
	data = {'barcode':barcode}

	if(barcode)
	{
		$.ajax({
			url:     base_url + segment1 + segment2 + 'search',
			type:     "patch",
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
					json = JSON.stringify(answer.items);
					item = JSON.parse(json);

					$('#item_id').val(item.id);
					$('#name').val(item.name);
					$('#price').val(item.price);
					$('#quantity').val(item.quantity);
					$('#js-item--sbm').text('Обновить');
					AnswerWarning('<strong>'+answer.message+'</strong>. Будет обновлен');
				}
		    },

		    error: function(answer) {
		    	AnswerError();
		    }

		}).complete(function() {
	        LoaderStop();
		});
	}
});

// create & update item
$('body').on('click', '#js-item--sbm', function(e){
	e.preventDefault();

	var data, id, url, type;
	
	data = $('#form_item').serialize();
	id 	 = $('#item_id').val();

	if(id == 0)
	{
		//create
		url = base_url + segment1 + segment2;
		type = "post";

	} else {
		//update
		url = id;
		type = "patch";
	}

	$.ajax({
		url 	 : url,
		type 	 : type,
		dataType : "json",
		data 	 : data,

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
				AnswerInfo(answer.message);
			}

	    },

	    error: function(answer) {
	    	AnswerError();
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

// if qty = 0 return 1 вставить везде
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

	var html, barcode, quantity, data, json, item;

	html 	 = "";
	barcode  = $('#js-item--print-review').val();
	quantity = $('#print-quantity').val();
	data 	 = {'barcode':barcode};

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'barcode/generate',
		type 	 : 'patch',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				json = JSON.stringify(answer.item);
				item = JSON.parse(json);
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
	    	AnswerError();
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
	
	var btn, type, json;

	btn  = $(this);
	type = Number(btn.val());

	if(localStorage){
		localStorage['order-type-index'] = $(this).index();
	}

	json = JSON.parse(localStorage.getItem('items'));
	json.type = type;
	localStorage.setItem('items', JSON.stringify(json));
	OrderTypeActive(btn);
});

// counterparty
$('body').on('change', '.js-supply--counterparty', function(e){

	var here, json;

	here = Number($("option:selected", this).val());
	json = JSON.parse(localStorage.getItem('items'));
	json.counterparty = here;
	localStorage.setItem('items', JSON.stringify(json));
});

// search item
$('#js-item--search').keyup(function(e){
	e.preventDefault();

	var barcode, data, json;

	barcode = $(this).val();
	data 	= {'barcode':barcode}

	if(barcode.length > 10)
	{
		$.ajax({
			url 	 : base_url + segment1 + 'items/search',
			type 	 : 'patch',
			dataType : 'json',
			data 	 : data,

			beforeSend: function(){
		        LoaderStart();
		    },

			success: function(answer) {
				if(answer.status == 0)
				{
					AnswerWarning('<button id="js-item--barcode-create" class="btn btn-danger">Отправить штрихкод</button>');
				}

				if(answer.status == 1)
				{
					$('.order').removeClass('hidden');
					$('#alert').removeClass().html('');
					data = JSON.stringify(answer.items);
					json = JSON.parse(data);
					OrderItemPaste(json);
				}
		    },

		    error: function(answer) {
		    	AnswerError();
		    }

		}).complete(function() {
				LoaderStop();
			});
	}
});

// select update item order
$(document).on('click', '.js-order--update', function(){
	var here, data;
	
	here = $(this);
	data = here.text();

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

	var parents, item, price, quantity, count, json, index;

	parents  = $(this).parents('tr');
	item  	 = parents.data('item');
	price 	 = parents.find('.js-order--price').val();
	quantity = parents.find('.js-order--quantity').val();
	count 	 = $('.order-table tbody tr').length;
	json 	 = JSON.parse(localStorage.getItem('items'));

	index = json.items.findIndex(function(array, i){
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

	var barcode, data;
	
	barcode = $('#js--item-search').val();
	data  	= {'barcode':barcode}

	$.ajax({
		url 	 : base_url + segment1 + 'items/barcode',
		type 	 : 'post',
		dataType : 'json',
		data 	 : data,

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
	    	AnswerError();
	    }

	}).complete(function() {
	        LoaderStop();
		});
});