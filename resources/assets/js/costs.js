/*
	------- COSTS FUNCTION ------- 
*/

// create costs
$('body').on('click', '#js-costs--create', function(e){
	e.preventDefault();

	var data = $('#js-costs--form').serialize();

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
				data = answer.data;

				data.date = moment(answer.data.created_at, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY');
				data.sum  = number_format(answer.data.sum, 0, ' ', ' ');

				html =  '<tr data-id="'+data.id+'">';
				html += '<td class="col-md-1">'+data.id+'</td>';
				html += '<td class="col-md-1">'+data.date+'</td>';
				html += '<td class="col-md-9 js--update js--sum data-column="sum">'+data.sum+'</td>';
				html += '<td class="col-md-1"><button class="btn btn-circle btn-danger js--delete"><li class="fa fa-remove"></li></button></td>';
				html += '</tr>';

				$('.table tbody').prepend(html);
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