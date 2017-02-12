/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Main functions	
	This global functions of the entire project
*/

// cashier
function CashierPageLoad()
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
	$('#js-modal--delete').modal('hide');
	$('#alert').removeClass().addClass('alert alert-info').html(answer);	
}

// answer warning
function AnswerWarning(answer)
{
	$('#js-modal--create').modal('hide');
	$('#alert').removeClass().addClass('alert alert-warning').html(answer);	
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

// don't close
$('.modal').modal({
    backdrop: 'static',
    keyboard: false,
    show: false,
});

$(document).ready(function() {

	function userPermissions(option)
	{
			$.each(option, function(i, param){
				switch(param)
				{
					case 'update':
						$('.table tbody tr td[data-column]').each(function(){
							$(this).addClass('js--update');
						});
					break;
					
					case 'delete':
						html = '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
						$('.table tbody tr').each(function(){
							$(this).append(html);
						});
					break;

					case 'status':
						$('.table tbody tr td button[data-status]').each(function(){
							$(this).addClass('js-items--status');
						});
					break;
				}
			});
	}

	/**
	 * Функция создающая ссылки для пользователя
	 * @param  {array} option массив с наименованием ссылок
	 */
	function userLinks(option)
	{
		var param = [];

		// check isset url
		$.each(option, function(i, v){
			$('ul.navbar-right li').each(function(){
				console.log($(this));
				if($(this).attr('id') == v)
				{
					return false;
				} else {
					param.push(v);
				}
			});
		});

		$.each(param, function(i, param){
			switch(param)
			{
				case 'create':
					$('ul.navbar-right').prepend('<li id="js--url-create"><a href="'+segment2+'/create">создать</a></li>');						
				break;

				case 'create-modal':
					$('ul.navbar-right').prepend('<li id="js--url-create-modal"><a href="#" data-toggle="modal" data-target="#js-modal--create">создать</a></li>');
				break;

				case 'date-range':
					html = '<li class="dropdown" id="js--url-date-range js--date_range-open">'
	                html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">';
	                html += 'настройки <span class="caret"></span>';
	                html += '</a>';
	                html += '<ul class="dropdown-menu dropdown-menu--lg" role="menu">';
	                html += '<li class="dropdown-header">Выбрать период</li>';
	                html += '<li>';
	                	html += '<div class="col-md-12">';
	                	html += '<form url="'+segment1+'/'+segment2+'/date" method="post" id="js-date_range--form">';

	                	html +=	'<div class="form-group col-md-push-1">';
	                		html +=	'<div class="input-group date datetimepicker">';
	                		html +=	'<input type="text" name="date_start" class="form-control input-sm" placeholder="Дата начала">';
	                		html += '<span class="input-group-addon">';
	                			html += '<span class="glyphicon glyphicon-calendar"></span>';
	                		html += '</span>';
	                		html += '</div>';
	                	html += '</div>';

	                	html += '<div class="form-group col-md-push-1">';
	                		html += '<div class="input-group date datetimepicker">';
	                		html += '<input type="text" name="date_end" class="form-control input-sm" placeholder="Дата конца">';
	                		html += '<span class="input-group-addon">';
	                			html += '<span class="glyphicon glyphicon-calendar"></span>';
	                		html += '</span>';
	                		html += '</div>';
	                	html += '</div>';
	                	
	                	html += '<button type="button" class="btn btn-primary btn-sm" id="js-date_range--sbm">Показать</button>';
	                	html += '</form>';
	                	html += '</div>';
	                html += '</li>';
	                html += '<li class="divider"></li>';
	                html += '</ul>';
	                html += '</li>';

	                $('ul.navbar-right').prepend(html);
				break;
			}
		});
	}

	/**
	 * Доступ пользователя
	 * @return {status} уровень пользователя
	 */
	function userAccess()
	{
		switch(parseInt(userOptions.status))
		{
			// cachier
			case 1:
			console.log('cashier', segment3);
				switch(segment2)
				{
					case 'orders':
						if(segment3.length == 0)
						{
							userLinks(['date-range', 'create']);
						}
					break;

					case 'items':
						return true;
					break;

					default:
						return false;
					break;
				}
			break;

			// manage
			case 2:
			console.log('manage');
				switch(segment2)
				{
					case 'items':
						return true;
					break;

					case 'orders':
						if(segment3.length == 0)
						{
							userLinks(['date-range']);
						}
					break;

					case 'supply':
						if(segment3.length == 0)
						{
							userLinks(['date-range']);
						}
					break;

					case 'costs':
						if(segment3.length == 0)
						{
							userLinks(['date-range']);
						}
					break;

					default:
						return false;
					break;
				}
			break;

			// admin
			case 3:
			console.log('admin', segment2);
				switch(segment2)
				{
					case 'items':
						userLinks(['create-modal']);
						userPermissions(['update', 'status']);
					break;

					case 'orders':
						if(segment3.length == 0)
						{
							userLinks(['date-range']);
						}
						userPermissions(['delete']);
					break;

					case 'supply':
						if(segment3.length == 0)
						{
							userLinks(['date-range', 'create']);							
						}

						userPermissions(['update', 'delete']);
					break;

					case 'costs':
						if(segment3.length > 0)
						{
							userLinks(['date-range', 'create-modal']);
						}

						userPermissions(['update', 'delete']);
					break;
				}
			break;

			// igor
			case 4:
			console.log('igor');
				switch(segment2)
				{
					case 'items':
						userLinks(['create-modal'])
						userPermissions(['update', 'status']);
					break;

					case 'orders':
						if(segment3.length == 0)
						{
							userLinks(['date-range']);
						}
						userPermissions(['delete']);
					break;

					case 'supply':
						if(segment3.length == 0)
						{
							userLinks(['date-range', 'create']);							
						}

						userPermissions(['update', 'delete']);
					break;

					case 'costs':
						if(segment3.length > 0)
						{
							userLinks(['date-range', 'create-modal']);
						}

						userPermissions(['update', 'delete']);
					break;
				}
			break;

			default:
			console.log(userOptions.status);

				return false;
			break;
		}
	}

	if(typeof userOptions !== 'undefined')
	{
		userAccess();		
	}

	// total sum
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
						html += '<td class="col-md-9 js--totalSum js--update" data-column="sum">'+data.sum+'</td>';
						html += '<td class="col-md-1"><button class="btn btn-circle btn-danger js--delete"><li class="fa fa-remove"></li></button></td>';
						html += '</tr>';

						$('.table tbody').prepend(html);
					break;

					case 'discounts':
						json.data.sum  = number_format(json.data.sum, 0, ' ', ' ');

						html = '<tr data-id="'+json.data.id+'">';
						html += '<td class="col-md-1">'+json.data.id+'</td>';
						html += '<td class="col-md-5 js--update" data-column="sum">'+json.data.sum+'</td>';
						html += '<td class="col-md-5 js--update" data-column="percent">'+json.data.percent+'</td>';
						html += '<td class="col-md-1"><button class="btn btn-danger btn-circle js--delete"><i class="fa fa-remove"></i></button></td>';
						html += '</tr>';

						$('.table tbody').prepend(html);
					break;

					$('.table tbody tr').removeClass().first().addClass('success');
				}

				AnswerInfo(json.message);
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

			// not found
			case 404:
			break;

			default:
				AnswerError();
			break;
		}

		LoaderStop();
	}

	// datepicker
	$('.datetimepicker').datetimepicker(
		{locale: 'ru', format: 'DD/MM/YYYY'}
	);

	// DATE RANGE
	$('#js-date_range--sbm').click(function(e){
		e.preventDefault();

		var data, url, html, json;
		data = $('#js-date_range--form').serializeArray();
		data.push({name: 'id', value: segment3});

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

					switch(segment2)
					{
						case 'costs':
							for(row in data)
							{
								html += '<tr data-id="'+data[row].id+'">';
								html += '<td class="col-md-1">'+data[row].id+'</td>';
								html += '<td class="col-md-1">'+data[row].date+'</td>';
								html += '<td class="col-md-9 js--totalSum" data-column="sum">'+data[row].sum+'</td>';
								html += '</tr>';
							}
						break;

						case 'supply':
							for(row in data)
							{
								html += '<tr data-id="'+data[row].id+'">';
								html += '<td class="col-md-2 js--url-link" data-url="'+segment2 +'/'+ data[row].id+'">'+data[row].id+'</td>';
								html += '<td class="col-md-1">'+data[row].date+'</td>';
								html += '<td class="col-md-3 js--totalSum data-column="sum">'+data[row].sum+'</td>';
								html += '<td class="col-md-2">'+data[row].type+'</td>';
								html += '</tr>';
							}

						break;

						case 'orders':
							for(row in data)
							{
								html += '<tr data-id="'+data[row].id+'">';
								html += '<td class="col-md-2 js--url-link" data-url="'+segment2 +'/'+ data[row].id+'">'+data[row].id+'</td>';
								html += '<td class="col-md-1">'+data[row].date+'</td>';
								html += '<td class="col-md-3 js--totalSum">'+data[row].sum+'</td>';
								html += '<td class="col-md-3">'+data[row].sum_discount+'</td>';
								html += '<td class="col-md-2">'+data[row].type+'</td>';
								html += '</tr>';
							}
						break;

						default:
							return false;
						break;
					}
					
					$('.table tbody').html(html);
					$('.totalSum').html('Итого: ' + answer.extra.totalSum + ' &#8381;');
				}
		    },

		    error: function(answer) {
		    	AnswerError();
		    }

		}).complete(function() {
			userAccess();
		    LoaderStop();
		});
	});

	// link url
	$('body').on('click', '.js--url-link', function(e){
		e.preventDefault();
		var url = $(this).data('url');
	    window.location = url;
	});

	// ---------- CREATE ----------

	$('#js-modal--create').on('show.bs.modal', function(){
		$('input').first().focus();
	});

	$('#js-modal--create').on('hidden.bs.modal', function(){
		$('input').val('');
		$('input[name=points_id]').val(userOptions.points_id);
	});

	// ---------- UPDATE ----------

	// select update item order
	$('body').on('click', '.js--update', function(){
		var here, data;
		
		here = $(this);
		data = here.text();

		// if date
		if(here.data('column') == 'created_at')
		{
			here.html('<input type="text" class="datetimepicker">');
			here.find('input').click();

			// дата пикер
			// оутпат которого пошлет запрос на update
		} else {
			here.html('<input type="number" id="js--update" placeholder="'+data+'">');
			here.find('input').focus();			
		}
	});

	// update press enter
	$('body').on('keypress', '#js--update', function(e){
		if(e.which == 13) {
			update($(this));
		}
	});
	
	// update focusout
	$('body').on('focusout', '#js--update', function(){
		update($(this));
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

		$(this).attr('id', 'active');
		$('#js-modal--delete').modal('show');
	});

	$('body').on('click', '#js--delete', function(e){
		e.preventDefault();

		var data, line, id;

		line = $('#active').parents('tr');
		id = line.data('id');

		$.ajax({
			url 	 : base_url + '/' + segment1 + '/' + segment2 + '/' + 'delete' + '/' + id,
			type 	 : 'post',
			dataType : 'json',
			data 	 : {"type":$('#active').parents('tbody').data('type')},

			beforeSend: function(){
		        LoaderStart();
		    },

		    complete: function(answer, xhr, settings){
		    	validationDelete(answer, line);
		    }

		});
	});

	$("#js-modal--delete").on("hidden.bs.modal", function (){ 
	    $('.js--delete').removeAttr('id');
	});


