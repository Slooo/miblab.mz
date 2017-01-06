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
		// запрос на скидки
		OrderTotalSum();
		OrderButtonActive($('.js-order--type').eq(localStorage['order-type-index']));
		OrderButtonActive($('.js-order--discount').eq(localStorage['order-discount-index']));
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
		json.discount = false;
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
		stock 	 : Number(json.stock),
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
function OrderButtonActive(index) 
{
	var btn = index.siblings();

	btn.each(function(){
	  $(this).removeClass('active');
	});

	index.addClass('active');
}

// loader start
function LoaderStart()
{
	//$('#js-modal--create').modal('hide');
	$('body').append('<div class="loader"></div>');	
}

// loader stop
function LoaderStop()
{
	$('.loader').remove();
	//$('#js-modal--create').modal('hide');
}

// answer success
function AnswerSuccess(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-success').html('<strong>'+answer+'</strong>');		
}

// answer error
function AnswerError()
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-danger').html('<strong>Ошибка запроса</strong>');	
}

// answer info
function AnswerInfo(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-info').html('<strong>'+answer+'</strong>');	
}

// answer warning
function AnswerWarning(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-warning').html('<strong>'+answer+'</strong>');	
}

// answer removed
function AnswerDanger(answer)
{
	$('#js-modal--create').modal('hide');
	qp = segment2.substring(0, segment2.length - 1);
	$('#alert').removeClass().addClass('alert alert-danger').html('<button class="btn btn-danger" id="js--restore-'+qp+'">Отменить удаление <i class="fa fa-history"></i></button>');	
}

// number format
function number_format( number, decimals, dec_point, thousands_sep ) {

	var i, j, kw, kd, km;

	// input sanitation & defaults
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

	return km + kw + kd;
}

function totalSumAndDiscount()
{
	var sum = 0;
	$('.js--sum').each(function(){
	    sum += parseFloat($(this).text().replace(/\s/g, ''));
	});

	var sum_discount = 0;
	$('.js--sum-discount').each(function(){
	    sum_discount += parseFloat($(this).text().replace(/\s/g, ''));
	});

	if($('strong').hasClass('totalSum'))
	{
		$('.totalSum').html('Итого ' + number_format(sum, 0, ' ', ' ') + ' &#8381;');	
	}

	if($('strong').hasClass('totalSumDiscount'))
	{
		$('.totalSumDiscount').html('Итого со скидкой ' + number_format(sum_discount, 0, ' ', ' ') + ' &#8381;');
	}
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

// ---------- CREATE ----------

$("#js-modal--create").on('show.bs.modal', function () {
	$('input').first().focus();
});

// create
$('body').on('click', '#js-discount--create', function(e){
	e.preventDefault();

	var data = $('#js-form--discounts').serialize();

	$.ajax({
		url 	 : base_url + segment1 + 'discounts',
		type 	 : 'post',
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
				html = '<tr data-id="'+answer.data.id+'">';
				html += '<td class="col-md-1">'+answer.data.id+'</td>';
				html += '<td class="col-md-5 js--sum js--update" data-column="sum">'+answer.data.sum+'</td>';
				html += '<td class="col-md-5 js--percent js--update" data-column="percent">'+answer.data.percent+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
				$('.table tbody tr').removeClass().first().addClass('success');

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

// ---------- UPDATE ----------

// update discount focusout
$(document).on('focusout', '#js--update', function(){
	update($(this));
});

// update discount press enter
$(document).on('keypress', '#js--update', function(e){
	if(e.which == 13) {
		update($(this));
	}
});

// select update item order
$(document).on('click', '.js--update', function(){
	var here, data;
	
	here = $(this);
	data = here.text();

	here.html('<input type="number" id="js--update" placeholder="'+data+'">');
	here.find('input').focus();
});

// update
function update(here){
	var here, id, line, column, data, json;

	if(here.val() == 0 || here.val().length == 0)
	{
		here.parent('td').html(here.attr('placeholder'));
	} else {

		line = here.parents('tr');
		id = line.data('id');
		column = here.parent('td').data('column');
		type = here.parents('tr').data('type');

		data = {"column":column, "value":here.val()};

		$.ajax({
			url 	 : base_url + segment1 + segment2 + id,
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
					val = number_format(here.val(), 0, ' ', ' ');
					here.parent('td').html(val);
					$('table tbody tr').removeClass();
					line.addClass('info');
					totalSumAndDiscount();
					
					AnswerInfo(answer.message);
				}
		    },

		    error: function(answer) {
		    	AnswerError();
		    }

		}).complete(function() {
				LoaderStop();
			});
	}
}

// ---------- DELETE ----------

$('body').on('click', '.js--delete', function(e){
	e.preventDefault();

	var data, line;

	line = $(this).parents('tr');

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'delete/' + line.data('id'),
		type 	 : 'post',
		dataType : 'json',
		data 	 : {"type":line.data('type'), "id":segment3},

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
				AnswerDanger(answer.data.id);
				line.remove();
				totalSumAndDiscount();
			}

			if(answer.status == 301)
			{
				$('.table').remove();
				AnswerDanger(answer.data.id);
				//window.location.href = base_url + segment1 + segment2;	
			}
	    },

	    error: function(answer) {
	    	AnswerError();
	    }

	}).complete(function() {
			LoaderStop();
		});
});

// ---------- RESTORE ----------

// restore orders
$('body').on('click', '#js--restore-orders', function(e){
	e.preventDefault();

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'restore',
		type 	 : 'post',
		dataType : 'json',

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
				type = (answer.data.type == 1 ? 'Налично' : 'Безналично');
				date = moment(answer.data.created_at, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY');

				html = '<tr data-id="'+answer.data.id+'" data-type="main">';
				html += '<td class="col-md-1 js-url--link" data-url="'+base_url+segment1+segment2+answer.data.id+'">'+answer.data.id+'</td>';
				html += '<td class="col-md-1">'+date+'</td>';
				html += '<td class="col-md-5 js--sum">'+answer.data.sum+'</td>';
				html += '<td class="col-md-5 js--sum-discount">'+answer.data.sum_discount+'</td>';
				html += '<td class="col-md-2">'+type+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
				$('.table tbody tr').removeClass().first().addClass('info');

				totalSumAndDiscount();

				AnswerInfo(answer.message);
			}

			if(answer.status == 2)
			{
				html = "";
				html = '<tr data-id="'+answer.data.pivot.id+'" data-type="pivot">';
				html += '<td class="col-md-1">'+answer.data.barcode+'</td>';
				html += '<td class="col-md-5">'+answer.data.name+'</td>';
				html += '<td class="col-md-5">'+answer.data.pivot.items_price+'</td>';
				html += '<td class="col-md-5">'+answer.data.pivot.items_quantity+'</td>';
				html += '<td class="col-md-5">'+answer.data.pivot.items_sum+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
				$('.table tbody tr').removeClass().first().addClass('info');

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

// restore discounts
$('body').on('click', '#js--restore-discounts', function(e){
	e.preventDefault();

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'restore',
		type 	 : 'post',
		dataType : 'json',

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
				html = '<tr data-id="'+answer.data.id+'" data-type="main">';
				html += '<td class="col-md-1">'+answer.data.id+'</td>';
				html += '<td class="col-md-5 js--sum js--update" data-column="sum">'+answer.data.sum+'</td>';
				html += '<td class="col-md-5 js--percent js--update" data-column="percent">'+answer.data.percent+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
				$('.table tbody tr').removeClass().first().addClass('info');

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

// restore costs
$('body').on('click', '#js--restore-costs', function(e){
	e.preventDefault();

	$.ajax({
		url 	 : base_url + segment1 + segment2 + 'restore',
		type 	 : 'post',
		dataType : 'json',

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
				date = moment(answer.data.date, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY');
				sum = number_format(answer.data.sum, 0, ' ', ' ');

				html = '<tr data-id="'+answer.data.id+'" data-type="pivot">';
				html += '<td class="col-md-1">'+answer.data.id+'</td>';
				html += '<td class="col-md-1">'+date+'</td>';
				html += '<td class="col-md-9 js--sum js--update" data-column="sum">'+sum+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
				$('.table tbody tr').removeClass().first().addClass('info');

				totalSumAndDiscount();

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

