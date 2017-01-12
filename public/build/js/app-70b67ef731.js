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
	$('#alert').removeClass().addClass('alert alert-success').html(answer);		
}

// answer error
function AnswerError()
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-danger').html('Ошибка запроса');	
}

// answer info
function AnswerInfo(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-info').html(answer);	
}

// answer warning
function AnswerWarning(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-warning').html(answer);	
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

// total um
function totalSumAndDiscount(data)
{
	var line, totalSum = 0, totalSumDiscount = 0;

	if($('strong').hasClass('totalSum'))
	{
		if(data)
		{
			line = $('.table tbody').find("[data-id='" + data.id + "']");
			$(line).find('td.js--totalSum').html(number_format(data.sum, 0, ' ', ' '));			
		}

		$('td.js--totalSum').each(function(){
			totalSum += parseFloat($(this).text().replace(/\s/g, ''));
		});

		$('.totalSum').html('Итого ' + number_format(totalSum, 0, ' ', ' ') + ' &#8381;');	
	}

	// пока непонятно как считать скидку при изменениях.
	if($('strong').hasClass('totalSumDiscount'))
	{
		$('.js--sum-discount').each(function(){
		    totalSumDiscount += parseFloat($(this).text().replace(/\s/g, ''));
		});

		$('.totalSumDiscount').html('Итого со скидкой ' + number_format(totalSumDiscount, 0, ' ', ' ') + ' &#8381;');
	}
}

// check delete
function validationDelete(answer, line)
{
	var json = JSON.parse(answer.responseText);

	switch(answer.status)
	{
		// error validation
		case 422:
			AnswerError();
		break;

		// redirect
		case 301:
			window.location.href = base_url +'/'+ segment1 +'/'+ segment2;	
		break;

		// success
		case 200:
			//AnswerDanger(json.data.id);
			AnswerInfo(json.message);
			line.remove();
			totalSumAndDiscount();
		break;

		default:
			AnswerError();
		break;
	}

	LoaderStop();
}

// check update
function validationUpdate(answer, here)
{
	var json = JSON.parse(answer.responseText);

	switch(answer.status)
	{
		// error validation
		case 422:
			here.parent('td').html(here.attr('placeholder'));

			//!
			$('.table tbody tr').removeClass();
			here.parents('tr').addClass('warning');

			AnswerWarning(json.message.value);
		break;

		// success
		case 200:
			/* проверять какой столбец и к какому типу он относится
				val = here.parent('td').data('column') == 'int' ? number_format(here.val(), 0, ' ', ' ' : here.val()
			*/
			val = number_format(here.val(), 0, ' ', ' ');

			here.parent('td').html(val);
			$('.table tbody tr').removeClass();
			here.parents('tr').addClass('info');
			totalSumAndDiscount(json.data);

			AnswerInfo(json.message);
		break;
	}

	LoaderStop();
}

// check create
function validationCreate(answer)
{
	var json, keys, input, data;
	json = JSON.parse(answer.responseText);

	switch(answer.status)
	{
		// error validation
		case 422:
			keys = Object.keys(json);

			$("form input").each(function(){
				input = $(this);
				if(keys.indexOf(input.attr('name')) != -1)
				{
					input.addClass('validate-error');
				} else {
					input.addClass('validate-success');
				}
			});
		break;

		// success
		case 200:
			switch(segment2)
			{
				case 'items':
					json.data.price  = number_format(json.data.price, 0, ' ', ' ');

					html =  '<tr data-id="'+json.data.id+'">'; 
					html += '<td>'+json.data.barcode+'</td>';
					html += '<td>'+json.data.name+'</td>';
					html += '<td class="js--update" data-column="price">'+json.data.price+'</td>';
					html += '<td><button class="btn btn-circle btn-success js-items--status" data-status="'+json.data.status+'"><i class="fa fa-check"></i></button></td>';
					html += '<td><button type="button" data-barcode="'+json.data.barcode+'" class="btn btn-circle btn-primary js-items--print-review"><i class="fa fa-print"></i></button></td>';
					html += '</tr>';

					$('.table tbody').prepend(html);
				break;

				case 'costs':
					data = json.data;
					data.date = moment(json.data.created_at, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY');
					data.sum  = number_format(json.data.sum, 0, ' ', ' ');

					html =  '<tr data-id="'+data.id+'">';
					html += '<td class="col-md-1">'+data.id+'</td>';
					html += '<td class="col-md-1">'+data.date+'</td>';
					html += '<td class="col-md-9 js--sum js--update" data-column="sum">'+data.sum+'</td>';
					html += '<td class="col-md-1"><button class="btn btn-circle btn-danger js--delete"><li class="fa fa-remove"></li></button></td>';
					html += '</tr>';

					$('.table tbody').prepend(html);
				break;

				case 'discounts':
					json.data.sum  = number_format(json.data.sum, 0, ' ', ' ');

					html = '<tr data-id="'+json.data.id+'">';
					html += '<td class="col-md-1">'+json.data.id+'</td>';
					html += '<td class="col-md-5 js--sum js--update" data-column="sum">'+json.data.sum+'</td>';
					html += '<td class="col-md-5 js--percent js--update" data-column="percent">'+json.data.percent+'</td>';
					html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
					html += '</tr>';

					$('.table tbody').prepend(html);
				break;

				$('.table tbody tr').removeClass().first().addClass('success');
			}

			AnswerInfo(json.message);
    	break;

		default:
			AnswerError();
		break;
	}

	LoaderStop();
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
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'date',
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

// ---------- UPDATE ----------

// update focusout
$(document).on('focusout', '#js--update', function(){
	update($(this));
});

// update press enter
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

		line   = here.parents('tr');
		id 	   = line.data('id');
		column = here.parent('td').data('column');
		type   = line.parents('tbody').data('type');
		data   = {"column":column, "value":here.val(), "type":type};

		$.ajax({
			url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + id,
			type 	 : 'patch',
			dataType : 'json',
			data 	 : data,

			beforeSend: function(){
		        LoaderStart();
		    },

		    complete: function(answer, xhr, settings){
			    validationUpdate(answer, here);
		    }

		});
	}
}

// ---------- DELETE ----------

$('body').on('click', '.js--delete', function(e){
	e.preventDefault();

	var data, line, id;

	line = $(this).parents('tr');
	id = line.data('id');

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'delete' + '/' + id,
		type 	 : 'post',
		dataType : 'json',
		data 	 : {"type":$(this).parents('tbody').data('type')},

		beforeSend: function(){
	        LoaderStart();
	    },

	    complete: function(answer, xhr, settings){
	    	validationDelete(answer, line);
	    }

	});
});

// ---------- RESTORE ----------

// restore orders
$('body').on('click', '#js--restore-orders', function(e){
	e.preventDefault();

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'restore',
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
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'restore',
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
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'restore',
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


/*
	------- ITEMS FUNCTION ------- 
*/

// create & update item
$('body').on('click', '#js-items--create', function(e){
	e.preventDefault();

	var data, id, url, type, json, html;
	
	data = $('#js-items--form').serialize();
	id 	 = $('#items_id').val();

	if(id == 0)
	{
		//create
		url = base_url + '/' + segment1 + '/' + segment2;
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

	    complete: function(answer, xhr, settings){
	    	validationCreate(answer);
	    }

	});

});

// update status
$('body').on('click', '.js-items--status', function(e){
	e.preventDefault();

	var btn, status, id, data;

	btn    = $(this);
	status = btn.attr('data-status');
	id 	   = btn.parents('tr').data('id');
	data   = {'id':id, 'status':status}

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'status',
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
			url:     base_url + '/' + segment1 + '/' + segment2 + '/' + 'search',
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
					item = JSON.parse(JSON.stringify(answer.items));

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

/* --- PRINT BARCODE --- */

// select barcode
$('body').on('click', '.js-items--print-review', function(e){
	e.preventDefault();
	var barcode = $(this).data('barcode');
	$('#print-modal strong').html(barcode);
	$('#js-items--print-review').val(barcode);
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
$('#js-items--print-cancel').click(function(e){
	$('.full').addClass('hidden');
	$('.row').removeClass('hidden');
	$('#print-modal').modal('hide');
});

// generate barcode
$('#js-items--print-review').click(function(e){

	$('#print-modal').modal('hide');
	$('.row').addClass('hidden');

	var html, barcode, quantity, data, json, item;

	html 	 = "";
	barcode  = $('#js-items--print-review').val();
	quantity = $('#print-quantity').val();
	data 	 = {'barcode':barcode};

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'barcode/generate',
		type 	 : 'patch',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 200)
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
$('body').on('click', '#js--items-print', function(e){
	e.preventDefault();
	window.print();
});

/* --- END PRINT BARCODE --- */
/*
	------- ORDERS FUNCTION ------- 
*/

// create order and supply
$('body').on('click', '#js-order-and-supply--create', function(e){
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
$('#js-item--search').keyup(function(e){
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
$(document).on('click', '.js-order--update', function(){
	var here, data;
	
	here = $(this);
	data = here.text();

	here.html('<input type="number" id="js-order--update" placeholder="'+data+'">');
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

/*
	------- SUPPLY FUNCTION ------- 
*/
/*
	------- COSTS FUNCTION ------- 
*/

// create costs
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#js-costs--form').serialize();

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2,
		type 	 : 'post',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

	    complete: function(answer, xhr, settings){
	    	validationCreate(answer);
	    }
	});
});
/*
	------- DISCOUNTS FUNCTION ------- 
*/

// create
$('body').on('click', '#js-discounts--create', function(e){
	e.preventDefault();

	var data = $('#js-discounts--form').serialize();

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2,
		type 	 : 'post',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

	    complete: function(answer, xhr, settings){
	    	validationCreate(answer);
	    }
	});
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
