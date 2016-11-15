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
		OrderTotalSum();
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
		json.totalSum = data.price * data.quantity;
		localStorage.setItem('items', JSON.stringify(json));
	} else {
		json = JSON.parse(localStorage.getItem('items'));
		json.items.push(data);
		localStorage.setItem('items', JSON.stringify(json));
	}

	OrderTotalSum();
}

// update order
function OrderUpdate(here)
{
	var parents, item, placeholder, price, quantity, sum;

	parents 	= here.parents('tr');
	item 	 	= parents.data('item');
	placeholder = here.attr('placeholder');
	value 		= Number(here.val());

	// return before value
	if(value.length == 0)
	{
		if(placeholder.length > 0)
		{
			here.val(placeholder);
		} else {
			here.val(1);
		}
	}

	// if 0 return 1
	if(value == 0)
	{
		here.val(1);
	}

	// if here = price
	if(here.parent('td').hasClass('js-order--update-price'))
	{
		price = value;
		quantity = Number(parents.find('.js-order--update-quantity').text());
	}

	// if here = quantity
	if(here.parent('td').hasClass('js-order--update-quantity'))
	{
		price = Number(parents.find('.js-order--update-price').text());
		quantity = value;
	}

	// update item
	OrderItemUpdate(here, item, price, quantity);
}

// order total sum
function OrderTotalSum()
{
	json = JSON.parse(localStorage.getItem('items'));
	totalSum = json.items.reduce(function(sum, current) {
		return sum + current.sum;
	}, 0);

	json.totalSum = totalSum;
	localStorage.setItem('items', JSON.stringify(json));
	$('#order-sum').html(totalSum);
}

// update item
function OrderItemUpdate(here, item, price, quantity)
{
	var json, sum, product;

	json = JSON.parse(localStorage.getItem('items'));

	// qty in stock
	max_qty = json.items[item].stock;

	// check quantity update with max qty in stock
	qty = (quantity <= max_qty ? quantity : max_qty);

	sum = price * qty;

	// set item
	json.items[item].price = price;
	json.items[item].quantity = qty;
	json.items[item].sum = sum;

	// save items
	localStorage.setItem('items', JSON.stringify(json));

	OrderTotalSum();
	
	// save item
	product = $('*[data-item="'+item+'"]');
	product.find('.js-order--sum').html(sum);

	// save all
	localStorage.setItem('order-table', $('.order-table').html());

	// return value input
	if(here && here.parent('td').hasClass('js-order--update-price'))
	{
		here.parent('td').html(price);		
	}

	if(here && here.parent('td').hasClass('js-order--update-quantity'))
	{
		here.parent('td').html(qty);		
	}
}

// order items paste in html
function OrderItemPaste(json)
{
	var html, item, id, price, quantity, data;

	item = $('.order-table tbody tr').length;

	html += '<tr data-item="'+item+'" data-id="'+json.id+'">';
	html += '<td>'+json.barcode+'</td>';
	html += '<td>'+json.name+'</td>';
	html += '<td class="js-order--update js-order--update-price">'+json.price+'</td>';
	html += '<td class="js-order--update js-order--update-quantity">1</td>';
	html += '<td class="js-order--sum">'+json.price+'</td>';
	html += '<td><button type="button" class="btn btn-xs btn-danger js-order--remove"><i class="fa fa-remove"></i></button></td>';
	html += '</tr>';

	// save object in localStorage
	data = {
		id 		 : json.id,
		item	 : item,
		barcode  : json.barcode,
		price    : Number(json.price),
		quantity : 1,
		sum 	 : Number(json.price),
		stock 	 : Number(json.stock)
	}

	OrderItemAdd(data);

	$('.order-table table tbody').append(html);
	localStorage.setItem('order-table', $('.order-table').html());
	CashierPageLoad();
}

// remove dublicate qty stock
function removeDuplicates(arr, prop) {
	var new_arr = [];
	var lookup  = {};

	for (var i in arr) {
		lookup[arr[i][prop]] = arr[i];
	}

	for (i in lookup) {
		new_arr.push(lookup[i]);
	}

	return new_arr;
}

// find element in array to object
function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
	for (var i = 0; i < arraytosearch.length; i++) {
 		if (arraytosearch[i][key] == valuetosearch) {
			return i;
		}
	}
	return 'z';
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