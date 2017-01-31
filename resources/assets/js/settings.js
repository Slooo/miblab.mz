/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Settings functions
	This global functions of the entire project
*/

// csrf token add to post request
$.ajaxSetup({
	headers: {
	  'X-CSRF-Token': $('meta[name="_token"]').attr('content')
	}
});

});