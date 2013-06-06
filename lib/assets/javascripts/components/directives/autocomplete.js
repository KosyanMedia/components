angular.module('Components').directive('asAutocomplete', ['$injector', function($injector){
  return {
    restrict: 'EAC',
    scope: {
      minLength: '@',
      acModel: '=acModel'
    },
    transclude: true,
    template: '<div ng-transclude>',
    replace: true,
    controller: ['$scope', '$element', '$timeout', '$attrs', function($scope, $element, $timeout, $attrs){
      var
        fetcher = $injector.get($attrs.fetcher),
        is_searching = false,

        can_search = function(term){
          return !is_searching && term && term.length >= $scope.minLength && term !== $scope.last_search;
        },
        process_data = function(data){
          is_searching = false;
          $scope.show_list = true;
          $scope.results = data;
        },
        term_changed = function(term){
          $scope.show_list = false;
          if(!can_search(term)){ return; }
          is_searching = true;
          fetcher.get(term, process_data);
        }

      this.scope = $scope;

      $scope.initial_value = angular.copy($scope.acModel);
      $timeout(function(){
        $scope.$apply('last_search=initial_value');
      }, 100);


      this.set_items = function(items_scope){
        items_scope.$watch('selected_item', function(selected_item){
          if(!selected_item){return;}
          $scope.last_search = selected_item;
          $scope.acModel = selected_item;
          $scope.results = [];
        });
      };

      this.set_input = function(input){
        $scope.input = input;
        input.bind("input", function(){
          $scope.results = [];
          term_changed(input.val());
        });
      };
    }]
  }
}]);

angular.module('Components').directive('asAutocompleteItem', ['$timeout', 'Offset', 'KeyCodes', function($timeout, Offset, KeyCodes){
  return {
    restrict: 'EAC',
    require: '^asAutocomplete',
    transclude: true,
    replace: true,
    template:
      '<ul class="as_autocomplete_results" ng-class="{on: show_list && items}">' +
        '<li ng-repeat="item in items" ng-click="item_selected()" ng-mouseenter="item_hovered(item)" ng-class="{highlight: is_hovered(item)}">' +
          '<div ng-transclude></div>' +
        '</li>' +
      '</ul>',
    link: function(scope, iElement, iAttrs, asAutocompleteCtrl){
      asAutocompleteCtrl.set_items(scope);
      asAutocompleteCtrl.scope.$watch('input', function(input){
        scope.bind_input(input);
      });
      asAutocompleteCtrl.scope.$watch('results', function(items){ scope.items = items; });
      asAutocompleteCtrl.scope.$watch('show_list', function(show_list){ scope.show_list = show_list });
    },
    controller: ['$scope', '$element', function($scope, $element){
      var
        directions = {
          next: function(){
            $scope.hovered_index++;
            if($scope.items.length <= $scope.hovered_index){ $scope.hovered_index = 0}
          },
          prev: function(){
            $scope.hovered_index--;
            if(0 > $scope.hovered_index){ $scope.hovered_index = $scope.items.length - 1}
          }
        };

      $scope.hovered_index = -1;
      $scope.show_list = true;

      $scope.bind_input = function(input){
        var body = angular.element(document.body);
        body.append($element);

        input
          .bind('input', function(){
            $scope.$apply('hovered_index = -1');
          })
          .bind('focus', function(){
            Offset.dock_to(input[0], $element);
            $scope.$apply('show_list = true');
          })
          .bind('blur', function(){
            $timeout(function(){
              $scope.$apply('show_list = false');
              $scope.$apply('hovered_index = -1');
            }, 200);
          })
          .bind("keydown", function(event){
            switch(KeyCodes.get(event.keyCode)){
            case 'UP':
              $scope.$apply(function(scope){ scope.change_hovered('prev') });
              break;
            case 'DOWN':
              $scope.$apply(function(scope){ scope.change_hovered('next') });
              break;
            case 'ENTER':
              event.preventDefault();
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'NUMPAD_ENTER':
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'ESCAPE':
              $scope.$apply('show_list = false');
              break;
            }
          });
      };

      $scope.change_hovered = function(direction){
        if(!$scope.items){return;}
        directions[direction]();
      };

      $scope.is_hovered = function(item){
        return $scope.items.indexOf(item) === $scope.hovered_index;
      };

      $scope.item_hovered = function(item){
        $scope.hovered_index = $scope.items.indexOf(item);
      };

      $scope.item_selected = function(){
        $scope.selected_item = $scope.items[$scope.hovered_index];
        $scope.show_list = false;
      };
    }]
  }
}]);

angular.module('Components').directive('asAutocompleteInput', [function(){
  return {
    restrict: "EAC",
    require: '^asAutocomplete',
    link: function(scope, iElement, iAttrs, asAutocompleteCtrl){
      var input = iElement.children('input');
      asAutocompleteCtrl.set_input(input);
      asAutocompleteCtrl.scope.$watch('last_search', function(last_search){
        scope.search = last_search;
      });
    }
  }
}]);


