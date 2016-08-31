/*
	------- ORDERS FUNCTION ------- 
*/

// order url
$('.js-order--url').click(function(e){
	e.preventDefault();
	var url = $(this).data('url');
    window.location=url;
});