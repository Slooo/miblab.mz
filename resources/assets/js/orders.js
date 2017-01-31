/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Orders functions	
*/

// create order and supply
$('body').on('click', '#js-orders-and-supply--create', function(e){
	e.preventDefault();

	var json, sum, sumDiscount, type, discount, counterparty, items, data;

	json  = JSON.parse(localStorage.getItem('items'));
	totalSum = json.totalSum;
	type  = json.type;
	discount = json.discount;
	counterparty = json.counterparty;
	items = JSON.stringify(json.items);
	data  = {'totalSum' : totalSum, 'type' : type, 'discount': discount, 'counterparty' : counterparty, 'items' : items};
	
	url = (url != 'supply' ? 'orders' : 'supply');

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + url,
		type 	 : 'post',
		dataType : 'json',
		data  	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				OrderClear();
				AnswerSuccess('<a href="'+base_url + '/' + segment1 + '/' + url + '/' + answer.message +'">Создано</a>');
			}
	    },

	    error: function(answer) {
	    	AnswerError();
		}

	}).complete(function() {
	        LoaderStop();
		});
});

// type order
$('body').on('click', '.js-order--type', function(e){
	
	var btn, type, json;

	btn  = $(this);
	type = btn.val();

	if(localStorage){
		localStorage['order-type-index'] = btn.index();
	}

	json = JSON.parse(localStorage.getItem('items'));
	json.type = type;
	localStorage.setItem('items', JSON.stringify(json));
	OrderButtonActive(btn);
});

// discount order
$('body').on('click', '.js-order--discount', function(e){
	
	var btn, json;

	btn = $(this);

	if(localStorage){
		localStorage['order-discount-index'] = btn.index();
	}

	json = JSON.parse(localStorage.getItem('items'));

	if($(this).hasClass('active'))
	{
		$(this).removeClass('active');
		json.discount = false;
	} else {
		$(this).addClass('active');
		json.discount = true;
	}

	localStorage.setItem('items', JSON.stringify(json));
});

// counterparty
$('body').on('change', '.js-supply--counterparty', function(e){

	var here, json;

	here = Number($("option:selected", this).val());
	json = JSON.parse(localStorage.getItem('items'));
	json.counterparty = here;
	localStorage.setItem('items', JSON.stringify(json));
});

var timer;
   $('#some_id').keyup(function () {
       window.clearTimeout(timer);
       if ($('#some_id').val().length > 2) {
           timer = setTimeout(function () {
               // тут ajax запрос
           }, 1000);
       }
   });


// search item
$('#js-items--search').keyup(function(e){
	e.preventDefault();

	var barcode, items, data, json, quantity, unique;

	window.clearTimeout(timer);

	barcode = $(this).val();

	items = localStorage.getItem('items');
	data = {'barcode':barcode, 'items':items};

	if(barcode.length > 10)
	{
		setTimeout(function(){ 
			$.ajax({
				url 	 : base_url + '/' + segment1 + '/' + 'items/search',
				type 	 : 'patch',
				dataType : 'json',
				data 	 : data,

				beforeSend: function(){
			        LoaderStart();
			    },

				success: function(answer) {
					if(answer.status == 2)
					{
						AnswerWarning('<button id="js-item--barcode-create" class="btn btn-danger">Отправить штрихкод</button>');
					}

					if(answer.status == 1)
					{
						$('.order').removeClass('hidden');
						$('#alert').removeClass().html('');

						json = JSON.parse(JSON.stringify(answer.data));
						OrderItemPaste(json);
					}

					if(answer.status == 0)
					{
						AnswerWarning(answer.message);
						$('table tr').removeClass('info');
						var parents = $('*[data-item="'+answer.data+'"]').addClass('info');
						parents.find('.js-order--update-quantity').html(quantity);
					}
			    },

			    error: function(answer) {
			    	AnswerError();
			    }

			}).complete(function() {
					LoaderStop();
				});
		}, 2000);
	}
});

// select update item order
$('body').on('click', '.js-order--update', function(){
	var here, data;
	
	here = $(this);
	data = here.text();

	here.html('<input type="number" id="js-order--update" placeholder="'+data+'">');
	here.find('input').focus();
});

// update item press enter
$('body').on('keypress', '#js-order--update', function(e){
	if(e.which == 13) {
		OrderUpdate($(this));
	}
});

// update item focusout
$('body').on('focusout', '#js-order--update', function(){
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
		OrderTotalSum();
		localStorage.setItem('order-table', $('.order-table').html());
	}
});

// create new item (cashier -> admin)
$('body').on('click', '#js-item--barcode-create', function(e){
	e.preventDefault();

	var barcode, data;
	
	barcode = $('#js--item-search').val();
	data  	= {'barcode':barcode}

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + 'items/barcode',
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