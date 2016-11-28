/*
	------- COSTS FUNCTION ------- 
*/

// create costs
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#form_costs').serialize();

	$.ajax({
		url 	 : base_url + segment1 + segment2.substring(0, segment2.length - 1),
		type 	 : 'post',
		dataType : 'json',
		data 	 : data,

		beforeSend: function(){
	        LoaderStart();
	    },

		success: function(answer) {
			if(answer.status == 1)
			{
				AnswerSuccess('<a href="'+base_url + segment1 + segment2 + answer.message+'">Расходы внесены</a>');
			}
	    },

	    error: function(answer) {
	    	AnswerError();
		}
	})
	.complete(function() {
	    LoaderStop();
		$('#price').val('');
	});
});