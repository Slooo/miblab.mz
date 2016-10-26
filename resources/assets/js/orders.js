/*
	------- ORDERS FUNCTION ------- 
*/

// order url
$('body').on('click', '.js-order--url', function(e){
	e.preventDefault();
	var url = $(this).data('url');
    window.location = url;
});