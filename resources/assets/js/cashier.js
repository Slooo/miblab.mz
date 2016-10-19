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
			url:      'search',
			type:     'POST',
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

// create order
$('body').on('click', '#js-order--create', function(e){
	e.preventDefault();

	var json = JSON.parse(localStorage.getItem('items'));
	var total = json.total;
	var type  = json.type;
	var items = JSON.stringify(json.items);
	var data  = {'price':total, 'type':type, 'items':items};

	$.ajax({
		url 	 : base_url + 'cashier/order',
		type 	 : 'POST',
		dataType : 'json',
		data  	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				OrderClear();
				AnswerSuccess(answer.message);
			}
	    },

	    error: function(answer) {
	    	AnswerError('Укажите тип оплаты');
		}

	}).complete(function() {
	        LoaderStop();
		});
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