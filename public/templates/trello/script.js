angular.module('trelloRedmine')

.controller('DashboardCtrl', ['$scope', '$timeout', '$modal', '$http',
	function($scope, $timeout, $modal, $http) {
		$scope.gridsterOptions = {
			margins: [20, 20],
			columns: 3,
			draggable: {
				handle: 'h3'
			}
		};

		$scope.widgets= [];

		$scope.clear = function() {
			$scope.widgets = [];
		};

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

		$http.get('/dashboard').success(function(data, status){
			$scope.widgets = data.dashboard.widgets;
		}).error(function(data, status){
			$scope.widgets.push({
				name: "Error #" + $scope.widgets.length,
				sizeX: 1,
				sizeY: 1,
                cards: [{
                    name: 'my card'
                },{
                    name: 'another one'
                }]
			});
		});

		$scope.addWidget = function() {
			$scope.widgets.push({
				name: "Userstory #" + $scope.widgets.length,
				sizeX: 1,
				sizeY: 1,
                cards: [{
                    name: 'my card'
                },{
                    name: 'another one'
                }]
			});
		};
        
        $scope.sortableTemplates = {
            connectWith: '.connectedSortable',
            dropOnEmpty: true
        };
	}
])

.controller('CustomWidgetCtrl', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.widgets.splice($scope.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			$modal.open({
				scope: $scope,
				templateUrl: 'templates/trello/widget_settings.html',
				controller: 'WidgetSettingsCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
	function($scope, $timeout, $rootScope, $modalInstance, widget) {
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

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.remove = function() {
			$scope.widgets.splice($scope.widgets.indexOf(widget), 1);
			$modalInstance.close();
		};

		$scope.submit = function() {
			angular.extend(widget, $scope.form);

			$modalInstance.close(widget);
		};

	}
])

.controller('AddCardCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
	function($scope, $timeout, $rootScope, $modalInstance, widget) {
		$scope.widget = widget;
		$scope.card = {name: '', thumb: ''};

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.submit = function() {
			widget.cards.push($scope.card);
			$modalInstance.close(widget);
		};

	}
])

// helper code
.filter('object2Array', function() {
	return function(input) {
		var out = [];
		for (i in input) {
			out.push(input[i]);
		}
		return out;
	}
});