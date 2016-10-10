/*
	------- MAIN FUNCTION ------- 
*/

// cashier
var CashierPageLoad = function CashierPageLoad()
{
	if(localStorage.getItem('order-table') == null)
	{
		$('.order').addClass('hidden');
		$('#js-item--search').val('').focus();
	} else {
		OrderTotalPrice();
		OrderTypeActive($('.js-order--type').eq(localStorage['order-type-index']));
		$('.order-table').removeClass('hidden').html(localStorage.getItem('order-table'));
	}
}

// clear order
function OrderClear()
{
	localStorage.clear();
	$('.order-table table tbody').html('');
	$('.js-order--type').removeClass('active');
	CashierPageLoad();
}

// update order
function OrderUpdate(here)
{
	var parents 	= here.parents('tr');
	var item 	 	= parents.data('item');
	var placeholder = here.attr('placeholder');

	if(here.val().length == 0)
	{
		if(placeholder.length > 0)
		{
			here.val(placeholder);
		} else {
			here.val(1);
		}
	}

	if(here.val() == 0)
	{
		here.val(1);
	}

	if(here.parent('td').hasClass('js-order--update-price'))
	{
		var price = Number(here.val());
		var quantity = parents.find('.js-order--update-quantity').text();
	}

	if(here.parent('td').hasClass('js-order--update-quantity'))
	{
		var price = parents.find('.js-order--update-price').text();
		var quantity = Number(here.val());
	}

	var sum = OrderItemUpdate(item, price, quantity);
	parents.find('.js-order--sum').html(sum);
	here.parent('td').html(here.val());
	localStorage.setItem('order-table', $('.order-table').html());
}

// get total
function OrderTotalPrice(){
	var json = JSON.parse(localStorage.getItem('items'));
	var total = json.items.reduce(function(sum, current) {
	  return sum + current.sum;
	}, 0);

	$('#order-total').html(total);
	json.total = total;
	localStorage.setItem('items', JSON.stringify(json));
}

// push item
function OrderItemAdd(data)
{
	var json, items;
	if(localStorage.getItem('items') == null)
	{
		json = {};
		items = [];
		json.items = items;
		json.items.push(data);
		json.total = data.price * data.quantity;
		localStorage.setItem('items', JSON.stringify(json));
	} else {
		json = JSON.parse(localStorage.getItem('items'));
		json.items.push(data);
		localStorage.setItem('items', JSON.stringify(json));
	}
}

// update item
function OrderItemUpdate(item, price, quantity)
{
	var json = JSON.parse(localStorage.getItem('items'));
	var sum = Number(price * quantity);
	json.items[item].price = price;
	json.items[item].quantity = quantity;
	json.items[item].sum = sum;
	localStorage.setItem('items', JSON.stringify(json));
	OrderTotalPrice();
	return sum
}

// order items paste
function OrderItemPaste(json)
{
	var html, item, id, price, quantity, data;

	item = $('.order-table tbody tr').length;

	for(post in json)
	{
		html += '<tr data-item="'+item+'">';
		html += '<td>'+json[post].barcode+'</td>';
		html += '<td>'+json[post].name+'</td>';
		html += '<td class="js-order--update js-order--update-price">'+json[post].price+'</td>';
		html += '<td class="js-order--update js-order--update-quantity">1</td>';
		html += '<td class="js-order--sum">'+json[post].price+'</td>';
		html += '<td><button type="button" class="btn btn-xs btn-danger js-order--remove"><i class="fa fa-remove"></i></button></td>';
		html += '</tr>';

		data = {
			item	 : item,
			id 		 : json[post].id,
			price    : Number(json[post].price),
			quantity : 1,
			sum 	 : Number(json[post].price)
		}

		OrderItemAdd(data);
	}

	$('.order-table table tbody').append(html);
	localStorage.setItem('order-table', $('.order-table').html());
	CashierPageLoad();
}

// active button
function OrderTypeActive(index) {
	var btn = index.siblings();

	btn.each(function(){
	  $(this).removeClass('active');
	});

	index.addClass('active');
}

// loader start
function LoaderStart()
{
	$('body').append('<div class="loader"></div>');	
}

// loader stop
function LoaderStop()
{
	$('.loader').remove();
}

// answer success
function AnswerSuccess(answer)
{
	$('#alert').removeClass().addClass('alert alert-success').html(answer);	
}

// answer error
function AnswerError(answer)
{
	$('#alert').removeClass().addClass('alert alert-danger').html(answer);			
}

// answer info
function AnswerInfo(answer)
{
	$('#alert').removeClass().addClass('alert alert-info').html(answer);	
}

// answer warning
function AnswerWarning(answer)
{
	$('#alert').removeClass().addClass('alert alert-warning').html(answer);	
}

$(document).ready(function() {

// datepicker
$(function () {
	$('#datetimepicker').datetimepicker(
		{language : 'ru', useSeconds : true, format: 'YYYY-MM-DD'}
	);
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
		url 	 : base_url + 'order',
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
		url:     'barcode',
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
/*
	------- COSTS FUNCTION ------- 
*/

// create costs
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#form_costs').serialize();

	$.ajax({
		url:      base_url + 'costs',
		type:     'POST',
		dataType: 'json',
		data: 	  data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				AnswerSuccess(answer.message);
			}
	    },

	    error: function(answer) {
	    	AnswerError('Заполните все поля');
		}
	})
	.complete(function() {
	    LoaderStop();
		$('#price').val('');
	});
});
/*
	------- ORDERS FUNCTION ------- 
*/

// order url
$('.js-order--url').click(function(e){
	e.preventDefault();
	var url = $(this).data('url');
    window.location=url;
});
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
/*
	------- SETTINGS FUNCTION ------- 
*/

// csrf token add to post request
$.ajaxSetup({
	headers: {
	  'X-CSRF-Token': $('meta[name="_token"]').attr('content')
	}
});

});
//# sourceMappingURL=app.js.map
