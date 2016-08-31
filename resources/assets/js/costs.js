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