/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Grid View Controller
 ------------------------------------------------------*/
app.controller('StatCtrl', ['$scope', 'ProductCRUD',
function($scope, ProductCRUD) {
	//Set App SubTitle
	$scope.title = 'Product Stats';
	$scope.cls = 'stats-header';
	$scope.top5 = [];
	//Get Chart Data
	ProductCRUD.crud('Data', '', function(data) {
		var topdata = [];
		costdata = [], pricedata = [], categories = [];
		data['products'].sort(function(a, b) {
			return b.Price - a.Price;
		});
		$.each(data['products'], function(i, prod) {
			if (i < 5) topdata.push(prod['Price']);
			categories.push(prod['ProductName']);
			pricedata.push(prod['Price']);
			costdata.push(prod['Cost']);
		});
		$scope.top5 = [{
			"name" : "Products",
			data : topdata,
			color : '#01a8aa'
		}];
		$scope.qty = [{
			"name" : "Price",
			data : pricedata,
			color : '#01a8aa'
		}, {
			"name" : "Cost",
			data : costdata,
			color : '#0160c3'
		}];
		//HighCharts Config
		$scope.Top5Chart = {
			options : {
				chart : {
					type : 'column',
					backgroundColor : null
				},
				xAxis : {
					categories : categories
				},
				tooltip : {
					format : '$'
				},
				plotOptions : {
					series : {
						stacking : ''
					}
				}
			},
			credits : {
				enabled : false
			},
			series : $scope.top5,
			title : {
				text : 'Top 5 Products by Selling price'
			}
		};
		//HighCharts Config
		$scope.PriceCostChart = {
			options : {
				chart : {
					type : 'column',
					backgroundColor : null
				},
				xAxis : {
					categories : categories
				},
				tooltip : {
					format : '$'
				},
				plotOptions: {
		            column: {
		                stacking: 'normal',
		                dataLabels: {
		                    enabled: false,
		                }
		            }
           		}


			},
			credits : {
				enabled : false
			},
			series : $scope.qty,
			title : {
				text : 'Products Price / Cost'
			}
		};
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});
	//Handle Resize
	$scope.reflow = function() {
		$scope.$broadcast('highchartsng.reflow');
	};
}]);