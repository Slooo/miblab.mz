/*
	------- ORDERS FUNCTION ------- 
*/

// create order and supply
$('body').on('click', '#js-order-and-supply--create', function(e){
	e.preventDefault();

	var json, sum, sumDiscount, type, items, data;

	json  = JSON.parse(localStorage.getItem('items'));
	sum   = json.sum;
	type  = json.type;
	items = JSON.stringify(json.items);
	data  = {'sum':sum, 'type':type, 'items':items};

	url = segment2.substring(0, segment2.length - 1)

	if(url != 'supply')
	{
		url = 'orders';
	}

	$.ajax({
		url 	 : base_url + segment1 + url,
		type 	 : 'POST',
		dataType : 'json',
		data  	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				OrderClear();
				AnswerSuccess('<strong><a href="'+base_url+segment1+url+'/'+answer.message+'">Успешно создано</a></strong>');
			}
	    },

	    error: function(answer) {
	    	AnswerError('Укажите тип оплаты');
		}

	}).complete(function() {
	        LoaderStop();
		});
});