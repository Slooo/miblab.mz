/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Main functions	
	This global functions of the entire project
*/

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
function orderButtonActive(index) 
{
	var btn = index.siblings();

	btn.each(function(){
	  $(this).removeClass('active');
	});

	index.addClass('active');
}

function Answer(type, message)
{
	switch(type)
	{
		case 'success':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-success').html(message);		
		break;

		case 'error':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-danger').html('Ошибка запроса');	
		break;

		case 'info':
			$('#js-modal--create').modal('hide');
			$('#js-modal--delete').modal('hide');
			$('#alert').removeClass().addClass('alert alert-info').html(message);	
		break;

		case 'warning':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-warning').html(message);	
		break;
	}
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
	$('#alert').removeClass().html('');
	$('.loader').remove();
	//$('#js-modal--create').modal('hide');
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

/**
 * Parse data in graphic
 * @return data
 */
function graphParseData(data, type)
{
	var obj = {}, arr = [], val, positive, result;

	val = data[1] < 0 ? Math.abs(data[1]) : data[1];
	value = val == undefined ? 0 : val;
	positive = data[1] < 0 ? false : true;

	switch(type)
	{
		case true:
			arr.push(data[0]);
			arr.push(value);
			arr.push(positive);
			return arr;
		break;

		case false:
			obj.name = data[0];
			obj.y = value;
			obj.positive = positive;
			return obj;
		break;

		default:
			return false;
		break;
	}
}

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
		// Menu links
		html = '<li class="dropdown">';
		    html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">';
		        html += userOptions.username+' <span class="caret"></span>';
		    html += '</a>';
		    html += '<ul class="dropdown-menu" role="menu">';

		    switch(parseInt(userOptions.status))
		    {
		    	case 1:
		    		html += '<li><a href="'+base_url+'/'+segment1+'/items">Товары</a></li>';
	            	html += '<li><a href="'+base_url+'/'+segment1+'/orders">Заказы</a></li>';
		    	break;

		    	case 2:
			    	html += '<li><a href="'+base_url+'/'+segment1+'/items">Товары</a></li>';
			    	html += '<li><a href="'+base_url+'/'+segment1+'/orders">Заказы</a></li>';
			    	html += '<li><a href="'+base_url+'/'+segment1+'/supply">Приходы</a></li>';
			    	html += '<li><a href="'+base_url+'/'+segment1+'/costs">Расходы</a></li>';
			    	html += '<li><a href="'+base_url+'/'+segment1+'/analytics">Аналитика</a></li>';
		    	break;

		    	case 3:
		    		html += '<li><a href="'+base_url+'/'+segment1+'/items">Товары</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/orders">Заказы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/supply">Приходы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/costs">Расходы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/discounts">Скидки</a></li>';
		    	break;

				case 4:
		    		html += '<li><a href="'+base_url+'/'+segment1+'/items">Товары</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/orders">Заказы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/supply">Приходы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/costs">Расходы</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/analytics">Аналитика</a></li>';
		    		html += '<li><a href="'+base_url+'/'+segment1+'/discounts">Скидки</a></li>';
		    	break;

		    	default:
		    		return false;
		    	break;
		    }

		    	html += '<li><a href="/logout"><i class="fa fa-btn fa-sign-out"></i>Выйти</a></li>';
		    html += '</ul>';
		html += '</li>';

		$('ul.nav.navbar-nav.navbar-right').append(html);

		if(option) {

		var param = []; checkOption = [];

		$('ul.nav.navbar-nav.navbar-right li.js--url-user-links').each(function(){
			var str = $(this).attr('id').substring(8);
			checkOption.push(str);
		});

		if(checkOption.length > 0)
		{
			Array.prototype.diff = function(a) {
			    return this.filter(function(i){return a.indexOf(i) < 0;});
			};
			param = option.diff(checkOption);
		} else {
			param = option;
		}

		$.each(param, function(i, param){
			switch(param)
			{
				case 'create':
					$('ul.navbar-right').prepend('<li class="js--url-user-links" id="js--url-create"><a href="'+segment2+'/create">создать</a></li>');						
				break;

				case 'create-modal':
					$('ul.navbar-right').prepend('<li class="js--url-user-links" id="js--url-create-modal"><a href="#" data-toggle="modal" data-target="#js-modal--create">создать</a></li>');
				break;

				case 'date-range':
					html = '<li class="dropdown js--url-user-links" id="js--url-date-range">'
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

				case 'graphics':
					html = '<li class="dropdown" id="js--url-graphics">';
						html += '<a href="'+base_url+'/'+segment1+'/'+segment2+'/graphics">графики</a>';
					html += '</li>';

					$('ul.navbar-right').prepend(html);
				break;

				case 'analyzes':
					html = '<li class="dropdown" id="js--url-analyzes">';
					    html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">';
					        html += 'анализы <span class="caret"></span>';
					    html += '</a>';

					    html += '<ul class="dropdown-menu dropdown-menu--lg" role="menu">';
					        html += '<li><a href="'+base_url+'/'+segment1+'/'+segment2+'/abc">ABC</a></li>';
					        html += '<li><a href="'+base_url+'/'+segment1+'/'+segment2+'/xyz">XYZ</a></li>';
					    html += '</ul>';
					html += '</li>';

					$('ul.navbar-right').prepend(html);
				break;

				default:
					return false;
				break;
			}
		});
		}
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
				switch(segment2)
				{
					case 'orders':					
						if(segment3.length == 0)
						{
							userLinks(['date-range', 'create']);
						}

					cashierPageLoad();
					break;

					default:
						return false;
					break;
				}
			break;

			// manage
			case 2:
				switch(segment2)
				{
					case 'items':
						userLinks();
					break;

					case 'analytics':
						userLinks(['analyzes', 'graphics']);
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
						if(segment3.length > 0)
						{
							userLinks(['date-range']);
						} else {
							userLinks();
						}
					break;

					default:
						return false;
					break;
				}
			break;

			// admin
			case 3:
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

					case 'analytics':
						userLinks(['analyzes', 'graphics']);
					break;
				}
			break;

			default:
				return false;
			break;
		}
	}

	if(typeof(userOptions) !== 'undefined')
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

	// check search
	function validationInputs(answer)
	{
		var json = JSON.parse(answer.responseText);

		console.log('status', json);
		switch(answer.status)
		{
			case 422:
				Answer('warning', '<button id="js-item--barcode-create" class="btn btn-danger">Отправить штрихкод</button>');
			break;

			case 200:
				$('.order').removeClass('hidden');
				orderItemPaste(json.data);
			break;

			case 201:
				var parents, qty, price, quantity, here;
				$('table tr').removeClass('info');

				parents  = $('*[data-item="'+json.data+'"]').addClass('info');
				qty 	 = parents.find('.js-order--update-quantity');
				price 	 = Number(parents.find('.js-order--update-price').html());
				quantity = Number(qty.html()) + 1;
				here 	 = qty.html(quantity);

				orderItemUpdate(here, json.data, price, quantity);
			break;

			default:
				Answer('error');
			break;
		}

		$('#js-items--search').val('');
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

				Answer('info', json.message);
				totalSumAndDiscount();
	    	break;

			default:
				Answer('error');
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

				Answer('warning', json.message.value);
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

				Answer('info', json.message);
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
				Answer('error');
			break;

			// redirect
			case 301:
				window.location.href = base_url +'/'+ segment1 +'/'+ segment2;	
			break;

			// success
			case 200:
				//AnswerDanger(json.data.id);
				Answer('info', json.message);
				line.remove();
				totalSumAndDiscount();
			break;

			// not found
			case 404:
			break;

			default:
				Answer('error');
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
								html += '<td class="col-md-1 js--url-link" data-url="'+segment2 +'/'+ data[row].id+'">'+data[row].id+'</td>';
								html += '<td class="col-md-1">'+data[row].date+'</td>';
								html += '<td class="col-md-9 js--totalSum data-column="sum">'+data[row].sum+'</td>';
								html += '</tr>';
							}
						break;

						case 'orders':
							for(row in data)
							{
								html += '<tr data-id="'+data[row].id+'">';
								html += '<td class="col-md-1 js--url-link" data-url="'+segment2 +'/'+ data[row].id+'">'+data[row].id+'</td>';
								html += '<td class="col-md-1">'+data[row].date+'</td>';
								html += '<td class="col-md-4 js--totalSum">'+data[row].sum+'</td>';
								html += '<td class="col-md-4">'+data[row].sum_discount+'</td>';
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
		    	Answer('error');
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


