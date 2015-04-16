/*------------------------------------------------------
 * @Author: Shreyas Bedekar
 * CreatedOn: 12/04/2015
 * ModifiedOn: 15/04/2105
 * Angular app module definition
 * App uses RouteProvide, autocomplete and ngGrid
 ------------------------------------------------------*/
var app = angular.module('app', ['ngRoute', 'autocompletesearch', 'ngGrid', 'highcharts-ng']);

/*----------------------------------
 * Tab based Navigation
 ----------------------------------*/
app.config(['$routeProvider',
function($routeProvider) {
	//Load Home view
	$routeProvider.when('/', {
		controller : 'HomeCtrl',
		templateUrl : 'components/form/_form.html'
	})
	//Load Edit view
	.when('/edit', {
		controller : 'EditCtrl',
		templateUrl : 'components/form/_form.html'
	})
	//Load All Data view
	.when('/allrecords', {
		controller : 'GridCtrl',
		templateUrl : 'components/grid/_grid.html'
	})
	//Load Stats view
	.when('/stats', {
		controller : 'StatCtrl',
		templateUrl : 'components/stats/_stats.html'
	})
	//IF any other URL redirect to Home view
	.otherwise({
		redirectTo : '/'
	});

}]);

/*-------------------------------------
 * Fix Tab Nav bar on Vertical Scrolling
 -------------------------------------*/
$(window).scroll(function() {
	var menu = $('#tab-header'), pos = menu.offset();
	if ($(this).scrollTop() < 20) {
		$("#header").show();
	} else if ($(this).scrollTop() <= pos.top) {
		$("#header").hide();
	}
});
