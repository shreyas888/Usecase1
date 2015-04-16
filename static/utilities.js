function notNullOrEmpty(input) {
    return (input != null
        && input != undefined
        && String(input).toLowerCase() != 'null'
        && String(input).toLowerCase() != 'undefined'
        && String(input).toLowerCase() != 'nan'
        && trim(String(input)).length > 0);
}

function isNullOrEmpty(input) {
    return (notNullOrEmpty(input) == false);
}

function trim(source) {
    source = ltrim(rtrim(source));
    return source.replace(/^\s+|\s+$/g, "");
}

function ltrim(source) {
    var l = 0;
    while(l < source.length && source[l] == ' ') {
        l++;
    }

    return source.substring(l, source.length);
}

function rtrim(source) {
    var l = source.length;
    while(l > 0 && source[l] == ' ') {
        l--;
    }

    return source.substring(0, l);
}
/*------------------Set Local Storage---------------------
 * IF 
 * 	LocalStorage exists
 * THEN
 * 	Save data in Local Storage
 * Else
 * 	Save data locally 
 */

//GLobal Storage variable to be used if browser does not support local storage
var LOCAL_DATA = {};
function setLocal(item, data, force){
	//Check IF local storage exists
	if(localStorage){
		//Check if data already exists
		if(!notNullOrEmpty(localStorage.getItem(item)) || force){
			//Set data in string format
			console.log('Data does not exists');
			localStorage.setItem(item, JSON.stringify(data));				
		}
	}
	//ELSE set data in a global stoarge variable 
	else{
		LOCAL_DATA[item] = data;
	}
}

function getLocal(item){
	var data = null;
	//Check IF local storage exists
	if(localStorage){
		//Check if data exists in local storage
		if(localStorage.getItem(item)){
			//retrieve and eval data 
			data = eval(localStorage.getItem('data'));				
		}
	}
	//ELSE get data from global storage variable
	else{
		data = LOCAL_DATA[item];
	}
	return data;
}
