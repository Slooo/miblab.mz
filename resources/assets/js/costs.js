/*
	------- COSTS FUNCTION ------- 
*/

// create costs
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#form_costs').serialize();

	$.ajax({
		url:      base_url + 'costs',
		type:     'POST',
		dataType: 'json',
		data: 	  data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				AnswerSuccess(answer.message);
			}
	    },

	    error: function(answer) {
	    	AnswerError('Заполните все поля');
		}
	})
	.complete(function() {
	    LoaderStop();
		$('#price').val('');
	});
});

// All
var all = 0;
$('.js-analytics-all--sum').each(function() {
    all += Number($(this).text());
});

$('#js-analytics-all-total').text(all);

// Month
var month = 0;
$('.js-analytics-month--sum').each(function() {
    month += Number($(this).text());
});

$('#js-analytics-month-total').text(month);

// Point month
var pointMonth = 0;
$('.js-analytics-point-month--sum').each(function() {
	pointMonth += Number($(this).text());
});

$('#js-analytics-point-month-total').text(pointMonth);

// Point month
var week30Day = 0;
$('.js-analytics-week-30day--sum').each(function() {
	week30Day += Number($(this).text());
});

$('#js-analytics-week-30day-total').text(week30Day);
