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
	url   = segment2.substring(0, segment2.length - 1)
	
	url = (url != 'supply' ? 'orders' : 'supply');

	$.ajax({
		url 	 : base_url + segment1 + url,
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
				AnswerSuccess('<a href="'+base_url + segment1 + url + '/' + answer.message +'">Создано</a>');
			}
	    },

	    error: function(answer) {
	    	AnswerError();
		}

	}).complete(function() {
	        LoaderStop();
		});
});
