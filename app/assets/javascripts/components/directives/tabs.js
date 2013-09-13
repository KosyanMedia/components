angular.module('Components').
  directive('tabs', function() {
    return {
      restrict: 'EA',
      transclude: true,
      scope: {},
      controller: ['$scope', '$element', function($scope, $element) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };

        this.addPane = function(pane, is_active) {
          if (panes.length === 0) {
            $scope.select(pane);
          } else {
            if (is_active) {
              $scope.select(pane);
            }
          }
          panes.push(pane);
        };
      }],
      template:
        '<div class="aviasales_tabs">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  });
