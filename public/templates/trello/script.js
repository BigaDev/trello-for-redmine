angular.module('trelloRedmine')

.controller('DashboardCtrl', ['$scope', '$timeout', '$modal', '$http',
	function($scope, $timeout, $modal, $http) {
		$scope.gridsterOptions = {
			margins: [20, 20],
			columns: 3,
			rows: 1,
			draggable: {
				handle: '.box-header'
			},
			swapping: true,
			resizable: {
	           handles: ['s']
	        }
		};

		$scope.widgets= [];

		$scope.clear = function() {
			$scope.widgets = [];
		};

		// on change to widget
		$scope.$watch(watchWidgetsList, function(newVal, oldVal) {
			if(!angular.equals(newVal, oldVal)) {
				// only save dashboard if change happened
				var dashboard = {
					"dashboard": {
						"widgets": $scope.widgets
					}
				};

				$http.post('/dashboard/save', dashboard)
				.success(function(data, status){
					console.log(status)
				}).error(function(err, status){
					console.log(err);
				});

				console.log(dashboard);
				delete dashboard;
			}
		}, true);

		function watchWidgetsList() {
		  return $scope.widgets.map(watchCardsList);
		}

		function watchCardsList (widget) {
		  return widget.cards.map(cardValue);
		}

		function cardValue(card) {
			return card;
		}

		$scope.addCard = function(widget) {
			$modal.open({
				scope: $scope,
				templateUrl: 'templates/trello/add_card.html',
				controller: 'AddCardCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		}

		$http.get('/dashboard/load').success(function(data, status){
			$scope.widgets = data.dashboard.widgets;
		}).error(function(data, status){
			$scope.widgets.push({
				name: "Error #" + $scope.widgets.length,
				sizeX: 1,
				sizeY: 1,
                cards: [{
                    name: 'my card'
                }, {
                    name: 'another one'
                }]
			});
		});

		// $scope.addWidget = function() {
		// 	$scope.widgets.push({
		// 		name: "Userstory #" + $scope.widgets.length,
		// 		sizeX: 1,
		// 		sizeY: 1,
  //               cards: [{
  //               	thumb: "http://cssdeck.com/uploads/media/items/2/2v3VhAp.png",
  //                   name: 'my card'
  //               },{
  //               	thumb: "http://cssdeck.com/uploads/media/items/6/6f3nXse.png",
  //                   name: 'another one'
  //               }]
		// 	});
		// };
        
        $scope.sortableTemplates = {
            connectWith: '.connectedSortable',
            dropOnEmpty: true,
            stop: function (event, ui) {
                $(ui.item).find("#overlay").show();
                setTimeout(function () {
                    $(ui.item).find("#overlay").hide();
                }, 1000);
            }
        };
 }
])

.controller('CustomWidgetCtrl', ['$scope', '$modal',
 function ($scope, $modal) {

        $scope.onCardClick = function () {
            ngDialog.open({
                template: 'add_card.html'
            });
        };

        $scope.remove = function (widget) {
            $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
        };

        $scope.openSettings = function (widget) {
            $modal.open({
                scope: $scope,
                templateUrl: 'templates/trello/widget_settings.html',
                controller: 'WidgetSettingsCtrl',
                resolve: {
                    widget: function () {
                        return widget;
                    }
                }
            });
        };

 }
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
 function ($scope, $timeout, $rootScope, $modalInstance, widget) {
        $scope.widget = widget;

        $scope.form = {
            name: widget.name,
            sizeX: widget.sizeX,
            sizeY: widget.sizeY,
            col: widget.col,
            row: widget.row
        };

        $scope.sizeOptions = [{
            id: '1',
            name: '1'
  }, {
            id: '2',
            name: '2'
  }, {
            id: '3',
            name: '3'
  }, {
            id: '4',
            name: '4'
  }];

        $scope.dismiss = function () {
            $modalInstance.dismiss();
        };

        $scope.remove = function () {
            $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
            $modalInstance.close();
        };

        $scope.submit = function () {
            angular.extend(widget, $scope.form);

            $modalInstance.close(widget);
        };

 }
])

.controller('AddCardCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
 function ($scope, $timeout, $rootScope, $modalInstance, widget) {
        $scope.widget = widget;
        $scope.card = {
            name: '',
            thumb: ''
        };

        $scope.dismiss = function () {
            $modalInstance.dismiss();
        };

        $scope.submit = function () {
            widget.cards.push($scope.card);
            $modalInstance.close(widget);
        };

 }
])

.directive('cardWatch', function() {
	function link($scope, elem, attributes) {
		// link function to watch specific dom element
	}

	return({
		link: link,
		restrict: 'A'
	});
})

// helper code
.filter('object2Array', function () {
    return function (input) {
        var out = [];
        for (i in input) {
            out.push(input[i]);
        }
        return out;
    }
});