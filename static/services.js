var app = angular.module('app');
app.factory('ProductCRUD', ['$http','$rootScope', function($http, $rootScope) {
	/*---------------------------------
	 * Check where UI is running from 
	 * HTTP Server
	 * OR 
	 * Local File System
	 */ 
	$rootScope.isLocal = !(~window.location.protocol.indexOf('http'));
	if($rootScope.isLocal){
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = "data/static.js";
		$("head").append(s);
		setLocal('data', STATIC_DATA['data']);
	}
	//Method to Save New Record Or Update Existing Record 
	var save = function(params, callback) {
		/*----------------Save/Add Logic -------------------
		 * IF 
		 * 	Id is found in params 
		 * THEN
		 * 	Update existing product
		 * ELSE
		 * 	Add New product
		 */
		if(notNullOrEmpty(params.Id)){
			if($rootScope.isLocal){
				var msg = 'Product already exists';
				var nameExists = false;
				var data = getLocal('data');
				/*----------------Save Logic -------------------
				 * IF 
				 * 	ProductName has changed 
				 * THEN
				 * 	Check for other product with same Product Name
				 * ELSE
				 * 	Update Product
				 */
				if(params.nameChange){
					$.each(data, function(i, product){
						if(product['Id'] !== params.Id && product['ProductName'].toLowerCase() === params.ProductName.toLowerCase()){
							nameExists = true;	
						}
					});
				}
				if(!nameExists){
					$.each(data, function(i, product){
						if(product['Id'] === params.Id){
							data[i] = params;
							msg = 'Done';
							setLocal('data', data, true);
							return true;
						}
					});	
				}
				callback.apply(this, [msg]);
			}
			else{
				$http.post('/save', params).
				success(callback).
				error(function(data) {
				});	
			}
			
		}
		else{
			if($rootScope.isLocal){
				var msg = 'Product already exists';
				var nameExists = false;
				var data = getLocal('data');
				/*----------------Save Logic -------------------
				 * IF 
				 * 	ProductName has changed 
				 * THEN
				 * 	Check for other product with same Product Name
				 * ELSE
				 * 	Update Product
				 */
				$.each(data, function(i, product){
					if(product['ProductName'].toLowerCase() === params.ProductName.toLowerCase()){
						nameExists = true;
						return true;	
					}
				});
				if(!nameExists){
					//Assign auto ID to product
					params.Id = data.length + 1;
					msg = 'Done';
					//Assign auto ID to product
					data.push(params);
					setLocal('data', data, true);
				}
				callback.apply(this, [msg]);
			}
			else{
				$http.put('/add', params).
				success(callback).
				error(function(data) {
				});	
			}
	      	
		}	
      //  POST request to Save/Update record:
   	};
   	
   	var del = function(params){
   		alert('delete');
   	};
   	var getGridData = function(callback) {
   		if($rootScope.isLocal){
			callback.apply(this,[{'products': getLocal('data')}]);		
		}	
		else{
			$http.get('/alldata').
			success(callback).
			error(function(data) {
			});	
		}
   		
	};
    return {
      crud: function(type, params, callback) {
      	switch(type){
      		case 'Save':
      			return save(params, callback);
      		break;
      		case 'Delete':
      			return del(params);
  			break;
  			case 'Data':
  				return getGridData(callback);
			break;
      	} 
      }
    };
}]);