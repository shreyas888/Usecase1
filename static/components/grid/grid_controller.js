/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Grid View Controller
 ------------------------------------------------------*/
app.controller('GridCtrl', ['$scope', 'ProductCRUD',
function($scope, ProductCRUD) {
	//Set App SubTitle
	$scope.title = 'All Products';
	$scope.cls = 'all-header';
	$scope.myData = '';
	//Grid Configuration
	$scope.gridOptions = {
		data : 'myData',
		columnDefs : [{
			field : 'Id',
			displayName : 'Product Id'
		}, {
			field : 'ProductName',
			displayName : 'Product Name'
		}, {
			field : 'Cost',
			displayName : 'Cost/Unit'
		}, {
			field : 'Price',
			displayName : 'Selling Price/Unit'
		}, {
			field : 'Quantity',
			displayName : 'Quantity'
		}]
	};
	//Get Grid Data
	ProductCRUD.crud('Data', '', function(data) {
		$scope.myData = data['products'];
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});
}]);