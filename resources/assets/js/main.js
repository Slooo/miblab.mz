/**
 * @author Robert Slooo
 * @mail   borisworking@gmail.com
 */

/*
	Main functions	
	This global functions of the entire project
*/

// list column type
function getTypeColumn(column)
{
	var type;
	switch(column)
	{
		case 'name':
			type = 'string';
		break;

		case 'price':
		case 'items_price':
		case 'sum':
			type = 'numeric';
		break;

		case 'items_quantity':
		case 'percent':
			type = 'integer';
		break;

		case 'created_at':
		case 'date':
			type = 'date';
		break;

		default:
			type = 'string';
		break;
	}

	return type;
}

// parse column
function getValueColumn(type, column)
{
	var parse;
	switch(type)
	{
		case 'string':
			parse = column.toString();
		break;

		case 'numeric':
			parse = number_format(column, 0, ' ', ' ');
		break;

		case 'integer':
			parse = Number(column);
		break;

		case 'date':
			parse = column.toString();
		break;
	}

	return parse;
}

// remove dublicate qty stock
function removeDuplicates(arr, prop) {
	var new_arr = [];
	var lookup  = {};

	for (var i in arr) {
		lookup[arr[i][prop]] = arr[i];
	}

	for (i in lookup) {
		new_arr.push(lookup[i]);
	}

	return new_arr;
}

// find elem in array to object
function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
	for (var i = 0; i < arraytosearch.length; i++) {
 		if (arraytosearch[i][key] == valuetosearch) {
			return i;
		}
	}
	return 'z';
}

function Answer(type, message)
{
	$('#alert').removeClass().html('');
	switch(type)
	{
		case 'success':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-success').html(message);		
		break;

		case 'error':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-danger').html('Ошибка запроса');	
		break;

		case 'info':
			$('#js-modal--create').modal('hide');
			$('#js-modal--delete').modal('hide');
			$('#alert').removeClass().addClass('alert alert-info').html(message);	
		break;

		case 'warning':
			$('#js-modal--create').modal('hide');
			$('#alert').removeClass().addClass('alert alert-warning').html(message);	
		break;
	}
}

// loader start
function LoaderStart()
{
	//$('#js-modal--create').modal('hide');
	$('body').append('<div class="loader"></div>');	
}

// loader stop
function LoaderStop()
{
	//$('#alert').removeClass().html('');
	$('.loader').remove();
	//$('#js-modal--create').modal('hide');
}

// number format
function number_format( number, decimals, dec_point, thousands_sep ) {

	var i, j, kw, kd, km;

	// input sanitation & defaults
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

	return km + kw + kd;
}

// don't close
$('.modal').modal({
    backdrop: 'static',
    keyboard: false,
    show: false,
});

/**
 * Parse data in graphic
 * @return data
 */
function graphParseData(data, type)
{
	var obj = {}, arr = [], val, positive, result;

	val = data[1] < 0 ? Math.abs(data[1]) : data[1];
	value = val == undefined ? 0 : val;
	positive = data[1] < 0 ? false : true;

	switch(type)
	{
		case true:
			arr.push(data[0]);
			arr.push(value);
			arr.push(positive);
			return arr;
		break;

		case false:
			obj.name = data[0];
			obj.y = value;
			obj.positive = positive;
			return obj;
		break;

		default:
			return false;
		break;
	}
}

// return analytics
function hcAnalytics(obj)
{
	console.log(obj);
	$.each(obj, function(i, v){
		switch(obj[i].type)
		{
			case 'hcColumn':
				hcColumn(obj[i].id, obj[i].data, obj[i].description);
			break;

			case 'hcPie':
				hcPie(obj[i].id, obj[i].data, obj[i].description);
			break;

			case 'hcWdl':
				hcWdl(obj[i].id, obj[i].data, obj[i].description);
			break;

			case 'hcInverted':
				hcInverted(obj[i].id, obj[i].data, obj[i].description);
			break;

			default:
				return false;
			break;
		}
	});
}
