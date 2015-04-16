/**
 * autocompletesearch
 * Autocomplete directive
 * Support Local and Remote search
 */

angular.module('autocompletesearch', [] )
.directive('autocompletesearch', function ($parse, $http) {
    return {
        restrict: 'E',
        scope: {
        	//Id for input and dropdown
            "id": "@id",
            //Empty Text
            "placeholder": "@placeholder",
            //Searched object
            "selectedObject": "=selectedobject",
            //Ajax URL for remote search
            "url": "@url",
            //Name of Field to Display in Results
            "displayField": "@displayField",
            //npModel for textfield
            "searchStr": "=searchStr",
            //Style for Input field
            "inputClass": "@inputclass",
            //TimeOut before start seraching
            "userPause": "@pause",
            //If Searching in Local data
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength"
        },
        templateUrl: 'components/search/_search.html',
        controller: function ( $scope ) {
            $scope.lastFoundWord = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
			
			//Check Min Word Length Set by User before start search
            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }
			
			//Populate Dropdown with search response
            $scope.processResults = function(responseData) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var displayFields = [];
                    if ($scope.displayField && $scope.displayField != "") {
                        displayFields = $scope.displayField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = "";

                        for (var t = 0; t < displayFields.length; t++) {
                            if (t > 0) {
                                titleCode = titleCode + " + ' ' + ";
                            }
                            titleCode = titleCode + "responseData[i]." + displayFields[t];
                        }


                        var resultRow = {
                            title: eval(titleCode),
                            originalObject: responseData[i]
                        };

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                    $scope.selectedObject = null;
                }
            };
			//Populate Dropdown with search response
            $scope.searchTimerComplete = function(str) {
                // Begin the search
				//If Local Search
                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                var evalStr = 'match = match || ($scope.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                                eval(evalStr);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches);
                        $scope.$apply();


                    }
                    //Remote Search 
                    else {
                        $http.get($scope.url + str, {}).
                        success(function(responseData, status, headers, config) {
                            $scope.searching = false;
                            $scope.processResults(responseData);
                        }).
                        error(function(data, status, headers, config) {
                            console.log("error");
                        });
                    }
                }

            };

            $scope.hoverRow = function(index) {
                $scope.currentIndex = index;
            };

            $scope.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                    } else {

                        if ($scope.searchStr.length >= $scope.minLength) {
                            $scope.showDropdown = true;
                            $scope.currentIndex = - 1;
                            $scope.results = [];

                            if ($scope.searchTimer) {
                                clearTimeout($scope.searchTimer);
                            }

                            $scope.searching = true;

                            $scope.searchTimer = setTimeout(function() {
                                $scope.searchTimerComplete($scope.searchStr);
                            }, $scope.pause);
                        }


                    }

                } else {
                    event.preventDefault();
                }
            };
			//Set Selected Record in result object
            $scope.selectResult = function(result) {
                $scope.searchStr = result.title;
                $scope.selectedObject = result.originalObject;
                $scope.showDropdown = false;
                $scope.results = [];
                //$scope.$apply();
            };
        },
		//Key events on search field
        link: function($scope, elem, attrs, ctrl) {
            elem.bind("keyup", function (event) {
            	//Up Arrow
                if (event.which === 40) {
                    if (($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex ++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                }
                //Down Arrow 
                else if (event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex --;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                }
                //Enter 
                else if (event.which == 13) {
                    if ($scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });


        }
    };
});

