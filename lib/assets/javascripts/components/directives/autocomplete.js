angular.module('Components').directive('asAutocomplete', ['$injector', function($injector){
  return {
    restrict: 'EAC',
    scope: {
      minLength: '@'
    },
    transclude: true,
    template: '<div ng-transclude>',
    replace: true,
    controller: function($scope, $element, $attrs){
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

      this.set_items = function(items_scope){
        items_scope.$watch('selected_item', function(selected_item){
          $scope.last_search = selected_item;
        });
      };

      this.set_input = function(input){
        $scope.input = input;
        input.bind("input", function(){
          term_changed(input.val());
        });
      };
    }
  }
}]);

angular.module('Components').directive('asAutocompleteItem', ['$timeout', 'Offset', 'KeyCodes', function($timeout, Offset, KeyCodes){
  return {
    restrict: 'EAC',
    require: '^asAutocomplete',
    transclude: true,
    replace: true,
    template:
      '<ul class="as_autocomplete_results on" ng-class="{on: show_list && items}">' +
        '<li ng-repeat="item in items" ng-click="item_selected()" ng-mouseenter="item_hovered(item)" ng-class="{highlight: is_hovered(item)}">' +
          '<div ng-transclude></div>' +
        '</li>' +
      '</ul>',
    link: function(scope, iElement, iAttrs, asAutocompleteCtrl){
      asAutocompleteCtrl.set_items(scope);
      asAutocompleteCtrl.scope.$watch('input', function(input){
        scope.bind_input(input);
      });
      asAutocompleteCtrl.scope.$watch('results', function(items){ scope.items = items });
      asAutocompleteCtrl.scope.$watch('show_list', function(show_list){ scope.show_list = show_list });
    },
    controller: function($scope, $element){
      var
        hovered_index = -1,
        directions = {
          next: function(){
            hovered_index++;
            if($scope.items.length === hovered_index){ hovered_index = 0}
          },
          prev: function(){
            hovered_index--;
            if(0 > hovered_index){ hovered_index = $scope.items.length - 1}
          }
        };

      $scope.show_list = true;
      $scope.bind_input = function(input){
        var body = angular.element(document.body);
        body.append($element);
        Offset.dock_to(input[0], $element);

        input
          .bind('focus', function(){
            $scope.$apply('show_list = true');
          })
          .bind('blur', function(){
            $timeout(function(){
              $scope.$apply('show_list = false');
            }, 10);
          })
          .bind('input', function(){
            $scope.$apply('hovered_index = -1');
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
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'NUMPAD_ENTER':
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'ESCAPE':
              $scope.$apply('show_list = false');
              break;
            case 'TYPE':
              $scope.$apply('hovered_index = -1');
              break;
            }
          });
      };

      $scope.change_hovered = function(direction){
        if(!$scope.items){return;}
        directions[direction]();
        $scope.hovered_item = $scope.items[hovered_index];
      };

      $scope.is_hovered = function(item){
        return item === $scope.hovered_item;
      };

      $scope.item_hovered = function(item){
        $scope.hovered_item = item;
        hovered_index = $scope.items.indexOf(item);
      };

      $scope.item_selected = function(){
        $scope.selected_item = $scope.hovered_item;
        $scope.show_list = false;
      };
    }
  }
}]);

angular.module('Components').directive('asAutocompleteInput', [function(){
  return {
    restrict: "EAC",
    require: '^asAutocomplete',

    link: function(scope, iElement, iAttrs, asAutocompleteCtrl){
      var input = iElement.children('input');
      asAutocompleteCtrl.set_input(input);
      asAutocompleteCtrl.scope.$watch('last_search', function(last_search){ scope.search = last_search });
    }
  }
}]);


