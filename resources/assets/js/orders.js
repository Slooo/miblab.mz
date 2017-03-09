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
	var parents, item, placeholder, value, price, quantity;

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
  
// search item
$('#js-items--search').keyup(function(e){
	e.preventDefault();

	var barcode, items, data, json, quantity, unique;

	barcode = $(this).val();

	// сделать здесь проверку по штрихкоду в объекте и просто его не отправлять

	items = localStorage.getItem('items');
	data = {'barcode':barcode, 'items':items};

	if(barcode.length == 13)
	{
		$.ajax({
			url 	 : base_url + '/' + segment1 + '/' + 'items/search',
			type 	 : 'patch',
			dataType : 'json',
			data 	 : data,

	    	beforeSend: function(){
	            LoaderStart();
	        },

	        complete: function(answer, xhr, settings){
	        	validationInputs(answer);
	        }

		});
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