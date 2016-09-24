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