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
	    	validationInputs(answer, 'create');
	    }
	});
});