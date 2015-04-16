/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Base Controller Class, Home and Edit Controllers
 ------------------------------------------------------*/

/*-------------------------------------------
 *Base Class for Home and Edit controllers 
 -------------------------------------------*/
function BaseController(ProductCRUD) {
	var $scope = this;
	//Set value for Editable Fields
	$scope.isEdit = false;
	//Attached View's Title
	$scope.title = '';
	//Master record to hold original data
	$scope.master = null;
	//Flag to enabled cancel button
	$scope.enabelCancel = false;
	//Flag to activate save button
	$scope.enableSave = false;
	//Text of search field
	$scope.text = null;
	//CRUD operation success message
	$scope.message = null;
	//Flag mark editable fields
	$scope.enableEdit = true;
	//Count of products record changes
	$scope.count = 0;
	//Attached view's header css class
	$scope.cls = 'home-header';
	//Object to access data If app loaded from file system and not from a web server
	$scope.localData = null;
	//Check if App is loaded locally
	if ($scope.$root.isLocal) {
		//Get data from local storage
		$scope.localData = getLocal('data');
		//Method defined in utilities.js
	}
	//Watch product record for changes
	$scope.$watch('product', function(newVal) {
		//If product changes from null to record
		if (newVal) {
			if ($scope.count === 0) {
				//Enable edit on text fields
				$scope.enableEdit = false;
				//Create Copy of record for reset
				$scope.master = angular.copy($scope.product);
			}
			$scope.count++;
		}
	});
	//Watch Product record to enable save button
	$scope.$watch('product', function(newVal) {
		$scope.enableSave = (newVal && (newVal != $scope.master));
	});
	//Cancel all changes and reset search field
	$scope.cancel = function() {
		$scope.product = null;
		$scope.text = null;
		$scope.count = 0;
	};
	$scope.formValid = function(){
		var isValid = true;
		var fields = ['ProductName', 'Price', 'Cost', 'Quantity'];
		$.each(fields, function(i, field){
			console.log(field);
			if(!notNullOrEmpty($scope.product[field])){
				isValid = false;
			}
		});
		return isValid;
	};
	//Check if Selling Price is greater than Cost 
	$scope.priceChange = function() {
		if ($scope.product.Price < $scope.product.Cost) {
			if (window.confirm('Selling Price cannot be less than Cost Price')) {
				$scope.product.Price = $scope.master.Price;
			}
		}
	};
}

app.controller('HomeCtrl', ['$scope', 'ProductCRUD',
function($scope, ProductCRUD) {
	//Inherit Base Controller
	BaseController.call($scope, ProductCRUD);
	//Watch for Autocomplete search's text change to enable Cancel button
	$scope.$watch('text', function(newVal) {
		$scope.enabelCancel = (newVal);
	});
	//Undo any changes made
	$scope.reset = function() {
		$scope.product = angular.copy($scope.master);
		$scope.count = 0;
	};
	//POST call to Save Record
	$scope.save = function() {
		//Check if Form is valid and complete
		if(!$scope.formValid()){
			alert('Please make sure that all form fields have appropriate value');
			return;	
		} 
		 
		if (JSON.stringify($scope.product) === JSON.stringify($scope.master)) {
			alert('Nothing new to save');
			return;
		}
		$scope.product.nameChange = ($scope.product.ProductName !== $scope.master.ProductName);

		if (window.confirm('Are you sure?')) {
			ProductCRUD.crud('Save', $scope.product, function(data) {
				if (data != 'Done') {
					alert('Product Name Exist, Please assing a different name');
				} else {
					$scope.text = $scope.product.ProductName;
					$scope.message = 'Product Updated Successfully';
					$scope.count = 0;
					alert($scope.message);
				}

			});
		}

	};
}]);

//Controller for Edit Tab - Add new values
app.controller('EditCtrl', function($scope, ProductCRUD) {
	//Inherit Base Controller
	BaseController.call($scope, ProductCRUD);
	//Set Edit flag to true
	$scope.isEdit = true;
	$scope.title = 'Add new Product';
	$scope.enableEdit = false;
	$scope.cls = 'edit-header';
	$scope.enabelCancel = true;
	//Add New Record
	$scope.save = function() {
		//Check if Form is valid and complete
		if(!$scope.formValid()){
			alert('Please make sure that all form fields have appropriate values');
			return;	
		} 
		if (window.confirm('Are you sure?')) {
			//Put call to add new record
			ProductCRUD.crud('Save', $scope.product, function(data) {
				if (data != 'Done') {
					alert('Product Name Exist, Please assing a different name');
				} else {
					$scope.text = $scope.product.ProductName;
					$scope.message = 'Product Added Successfully';
					$scope.count = 0;
					$scope.product = null;
					alert($scope.message);
				}
			});
		}
	};
});