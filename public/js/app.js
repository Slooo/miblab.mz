function hcColumn(data, container, title)
{
	Highcharts.chart(container, {

	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: title
	    },
	    xAxis: {
	        type: 'category',
	    },
		yAxis: {
	        title: {
	            text: '',
	        },
	    },
	    legend: {
	        enabled: false
	    },
	    plotOptions: {
	        series: {
	            borderWidth: 0,
				dataLabels: {
	            	enabled: true,
	            	formatter: function () {
	            	     return '<b>' + Highcharts.numberFormat(this.y, 0, ' ', ' ') + '</b> ';
	            	 }
	            }
	        }
	    },
	    tooltip: {
	        headerFormat: '',
	        pointFormat: '<b>{point.name}</b>: {point.y} руб.'
	    },
	    series: [{
	        colorByPoint: true,
	        data: JSON.parse(data)
	    }],

	});
}

function hcPie(data, container, title)
{
   Highcharts.chart(container, {
       chart: {
           plotBackgroundColor: null,
           plotBorderWidth: null,
           plotShadow: false,
           type: 'pie'
       },
       title: {
           text: title
       },
       tooltip: {
          formatter: function() {
            var val = this.point.positive ? this.y : this.y * (-1);
            return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(val, 0, ' ', ' ') +' руб.';
          }
       },
       plotOptions: {
           pie: {
               allowPointSelect: true,
               cursor: 'pointer',
               dataLabels: {
                	enabled: false,
                	formatter: function() {
                		return this.point.positive ? this.y : this.y * (-1);
                    },
               },
               showInLegend: true
           }
       },
       series: [{
           colorByPoint: true,
           data: JSON.parse(data)
       }]
   });
}

function hcWdl(data, container, title)
{
	Highcharts.chart(container, {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: 0,
	        plotShadow: false
	    },
	    title: {
	        text: title,
	        align: 'center',
	        verticalAlign: 'middle',
	        y: -130
	    },
	    tooltip: {
	        pointFormat: '<b>{point.y}</b> руб.'
	    },
	    plotOptions: {
	        pie: {
	            dataLabels: {
	                enabled: true,
	                distance: -50,
	                style: {
	                    fontWeight: 'bold',
	                    color: 'white'
	                }
	            },
	            startAngle: -90,
	            endAngle: 90,
	            center: ['50%', '75%']
	        }
	    },
	    series: [{
	        type: 'pie',
	        innerSize: '50%',
	        data: JSON.parse(data)
	    }]
	});
}

function hcInverted(data, container, title)
{
	var json = JSON.parse(data);
	Highcharts.chart(container, {

		chart: {
		    inverted: true,
		    polar: false
		},
	    
	    title: {
	        text: title
	    },

	    xAxis: {
	        categories: json.categories
	    },

	    series: [{
	        type: 'column',
	        colorByPoint: true,
	        data: json.data,
	        showInLegend: false
	    }],

	    tooltip: {
	    	pointFormat: '<b>{point.name}</b>{point.y} руб.'
	    }

	});
}
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Items functions
*/

// Create & Update item
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
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Orders functions	
*/

// cashier
function cashierPageLoad()
{
	if(localStorage.getItem('order-table') === null)
	{
		$('.order').addClass('hidden');
		$('#js-item--search').val('').focus();
	} else {
		orderTotalSum();
		orderButtonActive($('.js-order--type').eq(localStorage['order-type-index']));
		orderDiscount();
		$('.order-table').removeClass('hidden').html(localStorage.getItem('order-table'));
	}
}

// clear order
function orderClear()
{
	localStorage.clear();
	$('.order-table table tbody').html('');
	$('.js-order--type').removeClass('active');
	cashierPageLoad();
}

// push item
function orderItemPush(data)
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

	orderTotalSum();
	console.log('Add', json);
}

// update item
function orderItemUpdate(here, item, price, quantity)
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

	orderTotalSum();
	
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

	console.log('Update', json);
}

// delete order
function orderItemDelete(here)
{
	var parents, item, price, quantity, count, json, index;

	parents  = here.parents('tr');
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
		orderClear();
	} else {
		orderTotalSum();
		localStorage.setItem('order-table', $('.order-table').html());
	}

	console.log('Delete', json);
}

// update order
function orderUpdate(here)
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
	orderItemUpdate(here, item, price, quantity);
}

// order total sum
function orderTotalSum()
{
	json = JSON.parse(localStorage.getItem('items'));
	totalSum = json.items.reduce(function(sum, current) {
		return sum + current.sum;
	}, 0);

	// если есть скидка 5%
	if(json.discount === true)
	{
		totalSum = totalSum - (totalSum / 20);
	}

	json.totalSum = totalSum;

	localStorage.setItem('items', JSON.stringify(json));
	$('#order-sum').html(totalSum);
}

// discount
function orderDiscount()
{
	var json = JSON.parse(localStorage.getItem('items'));
	var btn = $('#js-order--discount');
	var discount = localStorage.getItem('orderDiscount');		

	if(discount === 'true')
	{
		json.discount = true;
		btn.addClass('active');
	} else {
		json.discount = false;
		btn.removeClass('active');
	}

	localStorage.setItem('orderDiscount', json.discount);
	localStorage.setItem('items', JSON.stringify(json));
	orderTotalSum();
}

// order items paste in html
function orderItemPaste(json)
{
	var html, item, id, price, quantity, data;

	item = $('.order-table tbody tr').length;

	html += '<tr data-item="'+item+'" data-id="'+json.id+'">';
	html += '<td>'+json.barcode+'</td>';
	html += '<td>'+json.name+'</td>';
	html += '<td class="js-order--update js-order--update-price">'+json.price+'</td>';
	html += '<td class="js-order--update js-order--update-quantity">1</td>';
	html += '<td class="js-order--sum">'+json.price+'</td>';
	html += '<td><button type="button" class="btn btn-xs btn-danger js-order--delete"><i class="fa fa-remove"></i></button></td>';
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

	orderItemPush(data);

	$('.order-table table tbody').append(html);
	localStorage.setItem('order-table', $('.order-table').html());
	cashierPageLoad();
}

/**
 * Функция рисовки страницы orders
 */
function ordersPage()
{
	
}

// create order and supply
$('body').on('click', '#js-orders-supply--create', function(e){
	e.preventDefault();

	var json, sum, sumDiscount, type, discount, counterparty, items, data;

	json  = JSON.parse(localStorage.getItem('items'));
	totalSum = json.totalSum;
	type  = json.type;
	discount = json.discount;
	counterparty = json.counterparty;
	items = JSON.stringify(json.items);
	data  = {'totalSum' : totalSum, 'type' : type, 'discount': discount, 'counterparty' : counterparty, 'items' : items};
	
	//url = (url != 'supply' ? 'orders' : 'supply');

	$.ajax({
		url 	 : base_url + '/' + segment1 + '/' + segment2,
		type 	 : 'post',
		dataType : 'json',
		data  	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				orderClear();
				Answer('success', '<a href="'+base_url + '/' + segment1 + '/' + segment2 + '/' + answer.message +'">Создано</a>');
			}
	    },

	    error: function(answer) {
	    	Answer('error');
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
	orderButtonActive(btn);
});



// discount order
$('body').on('click', '#js-order--discount', function(e){
	var getDiscount = localStorage.getItem('orderDiscount');		
	var setDiscount = getDiscount === 'true' ? 'false' : 'true';
	localStorage.setItem('orderDiscount', setDiscount);
	orderDiscount();
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
						Answer('warning', '<button id="js-item--barcode-create" class="btn btn-danger">Отправить штрихкод</button>');
					}

					if(answer.status == 1)
					{
						$('.order').removeClass('hidden');
						$('#alert').removeClass().html('');

						json = JSON.parse(JSON.stringify(answer.data));
						orderItemPaste(json);
					}

					if(answer.status == 0)
					{
						Answer('warning', answer.message);
						$('table tr').removeClass('info');
						var parents = $('*[data-item="'+answer.data+'"]').addClass('info');
						parents.find('.js-order--update-quantity').html(quantity);
					}
			    },

			    error: function(answer) {
			    	Answer('error');
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
		orderUpdate($(this));
	}
});

// update item focusout
$('body').on('focusout', '#js-order--update', function(){
	orderUpdate($(this));
});

// delete item order
$('body').on("click", ".js-order--delete", function(){
	orderItemDelete($(this));
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
				Answer('error');
			}

			if(answer.status == 1)
			{
				Answer('success');
			}

	    },

	    error: function(answer) {
	    	Answer('error');
	    }

	}).complete(function() {
	        LoaderStop();
		});
});
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Supply functions	
*/
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Costs functions
*/

// Create
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#js-costs--form').serializeArray();
		data.push({name: 'ccosts_id', value: segment3});

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
/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Discounts functions
*/

// Create
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



/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Settings functions
	This global functions of the entire project
*/

// csrf token add to post request
$.ajaxSetup({
	headers: {
	  'X-CSRF-Token': $('meta[name="_token"]').attr('content')
	}
});

});
//# sourceMappingURL=app.js.map
