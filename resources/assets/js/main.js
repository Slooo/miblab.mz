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
	var parents, item, placeholder, price, quantity, sum;

	parents 	= here.parents('tr');
	item 	 	= parents.data('item');
	placeholder = here.attr('placeholder');

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
		price = Number(here.val());
		quantity = parents.find('.js-order--update-quantity').text();
	}

	if(here.parent('td').hasClass('js-order--update-quantity'))
	{
		price = parents.find('.js-order--update-price').text();
		quantity = Number(here.val());
	}

	sum = OrderItemUpdate(item, price, quantity);
	parents.find('.js-order--sum').html(sum);
	here.parent('td').html(here.val());
	localStorage.setItem('order-table', $('.order-table').html());
}

// get sum && sum_discount
function OrderTotalPrice(){
	var json, sum;
	
	json = JSON.parse(localStorage.getItem('items'));
	sum = json.items.reduce(function(sum, current) {
	  return sum + current.sum;
	}, 0);

	$('#order-sum').html(sum);
	json.sum = sum;
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
		json.sum = data.price * data.quantity;
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
	var json, sum;

	json = JSON.parse(localStorage.getItem('items'));
	sum  = Number(price * quantity);

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
	$('#alert').removeClass().addClass('alert alert-success').html('<strong>'+answer+'</strong>');		
}

// answer error
function AnswerError()
{
	$('#alert').removeClass().addClass('alert alert-danger').html('<strong>Ошибка запроса</strong>');	
}

// answer info
function AnswerInfo(answer)
{
	$('#alert').removeClass().addClass('alert alert-info').html('<strong>'+answer+'</strong>');	
}

// answer warning
function AnswerWarning(answer)
{
	$('#alert').removeClass().addClass('alert alert-warning').html('<strong>'+answer+'</strong>');	
}

$(document).ready(function() {

// datepicker
$(function () {
	$('#datetimepicker, #datetimepicker2').datetimepicker(
		{locale: 'ru', format: 'DD/MM/YYYY'}
	);
});

// DATE RANGE
$('#js-settings--date-range').click(function(e){
	e.preventDefault();

	var dateStart, dateEnd, data, url, segments, html, json;

	dateStart = $('#date_start').val();
	dateEnd   = $('#date_end').val();
	data 	  = {'dateStart' : dateStart, 'dateEnd' : dateEnd, 'id' : segment3};

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'date',
		type 	 : "patch",
		dataType : "json",
		data 	 : data,

		beforeSend: function(){
			$('.dropdown').removeClass('open');
	        LoaderStart();
	    },

		success: function(answer) {

			$('.col-body h2').remove();

			if(answer.status == 0)
			{
				$('.table').addClass('hidden');
				$('.col-footer').addClass('hidden');
				$('.col-body').append('<h2>'+answer.data+'</h2>');
			}

			if(answer.status == 1)
			{
				html = "";
				json = JSON.stringify(answer.data);
				data = JSON.parse(json);
				
				$('.table').removeClass('hidden');
				$('.col-footer').removeClass('hidden');

				if(segment2 != 'costs/')
				{
					for(row in data)
					{
						html += '<tr data-id="'+data[row].id+'" data-type="main">';
						html += '<td class="col-md-2 js-url--link" data-url="'+base_url + segment1 + segment2 + data[row].id+'">'+data[row].id+'</td>';
						html += '<td class="col-md-1">'+data[row].date+'</td>';
						html += '<td class="col-md-3">'+data[row].sum+'</td>';
						html += '<td class="col-md-3">'+data[row].sum_discount+'</td>';
						html += '<td class="col-md-2">'+data[row].type+'</td>';
						html += '<td class="col-md-1"><button class="btn btn-circle btn-danger js--delete"><li class="fa fa-remove"></li></button></td>';
						html += '</tr>';
					}

				} else {
					for(row in data)
					{
						html += '<tr data-id="'+data[row].id+'" data-type="pivot">';
						html += '<td class="col-md-1">'+data[row].date+'</td>';
						html += '<td class="col-md-10">'+data[row].sum+'</td>';
						html += '<td class="col-md-1"><button class="js--delete btn btn-circle btn-danger"><li class="fa fa-remove"></li></button></td>';
						html += '</tr>';
					}
				}

				$('.table tbody').html(html);
				$('.totalSum').html('Итого: ' + answer.extra.totalSum + ' &#8381;');
			}
	    },

	    error: function(answer) {
	    	AnswerError();
	    }

	}).complete(function() {
	    LoaderStop();
	});
});

// link url
$('body').on('click', '.js-url--link', function(e){
	e.preventDefault();
	var url = $(this).data('url');
    window.location = url;
});

// CHANGE UPDATE => costs | supply | items
$('.js--update').on('click', function(){
	var here, data, type;

	here = $(this);
	data = here.text().replace(/\s+/g, '');
	type = here.data('type');

	here.html('<input type="text" data-type="'+type+'" value="'+data+'">');
	here.attr('id', 'js--update');
	here.find('input').numeric().focus();
});

// UPDATE => costs | supply | items
$(document).on('focusout', 'td#js--update input', function(){
	var here, id, val, col, data;

	here = $(this);
	id   = here.parents('tr').data('id');
	val  = here.val().replace(/\s+/g, '');
	col  = here.data('type');

	data = {'id' : id, 'col' : col, 'val' : val};

	segment3 = (segment3 == '' ? id : segment3);

	if(val.length > 0) {
		$.ajax({
			url 	 : base_url + segment1 + segment2 + segment3,
			type 	 : "patch",
			dataType : "json",
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
					if($('strong').hasClass('totalSum') || $('strong').hasClass('totalSumDiscount'))
					{
						$('.totalSumDiscount').html('Итого со скидкой: ' + answer.data.totalSumDiscount + ' &#8381;');
						$('.totalSum').html('Итого: ' + answer.data.totalSum + ' &#8381;');						
					}

					here.parents('tr').find('.sum').text(answer.data.sum);
					here.parent('td').removeAttr('id').text(answer.data.value);

					AnswerSuccess(answer.message);
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

// DELETE => costs | orders | supply | items
$('body').on('click', '.js--delete', function(e){
	e.preventDefault();

	var here, id, type, data;

	here = $(this);
	id   = here.parents('tr').data('id');
	type = here.parents('tr').data('type');
	data = {'id' : id, 'type' : type};

	segment3 = (segment3 == '' ? id : segment3);

	$.ajax({
		url 	 : base_url + segment1 + segment2 + segment3,
		type 	 : 'delete',
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
				here.parents('tr').remove();
				if($('strong').hasClass('totalSumDiscount') || $('strong').hasClass('totalSum'))
				{
					$('.totalSum').html('Итого: ' + answer.data.totalSum + ' &#8381;');
					$('.totalSumDiscount').html('Итого со скидкой: ' + answer.data.totalSumDiscount + ' &#8381;');					
				}

				AnswerInfo(answer.message);
			}

			if(answer.status == 'redirect')
			{
				window.location.href = base_url + segment1 + segment2;
			}
	    },

	    error: function(answer) {
	    	AnswerError();
	    }

	}).complete(function() {
			LoaderStop();
		});
});