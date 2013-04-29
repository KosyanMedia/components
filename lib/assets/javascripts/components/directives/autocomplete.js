angular.module('Components').directive('asAutocomplete', ['$compile', '$injector', '$timeout', 'KeyCodes', 'Offset', function($compile, $injector, $timeout, KeyCodes, Offset){
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
          $scope.items_scope.show_list = true;
          $scope.items_scope.items = data;
        },
        term_changed = function(term){
          if(!can_search(term)){ return; }
          is_searching = true;
          fetcher.get(term, process_data);
        },
        item_selected = function(){
          var selected_item = $scope.items_scope.item_selected();
          $scope.last_search = $scope.input_scope.search = selected_item;
        }

      this.set_items_scope = function(items_scope){
        $scope.items_scope = items_scope;
      };

      this.set_input = function(input_scope, search_input){
        $scope.input_scope = input_scope;
        $scope.items_scope.bind_input(search_input);

        search_input.bind("keydown", function(event){
          switch(KeyCodes.get(event.keyCode)){
          case 'ENTER':
            $scope.$apply(item_selected);
            break;
          case 'NUMPAD_ENTER':
            $scope.apply(item_selected);
            break;
          case 'TYPE':
            $timeout(function(){ term_changed(search_input.val()); }, 10);
            break;
          }
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
      asAutocompleteCtrl.set_items_scope(scope);
    },
    controller: function($scope, $element){
      var hovered_index = -1;

      $scope.show_list = true;

      $scope.bind_input = function(search_input){
        var body = angular.element(document.body);
        body.append($element);
        Offset.dock_to(search_input[0], $element);

        search_input.bind('focus', function(){
          $scope.$apply('show_list = true');
        });

        search_input.bind('blur', function(){
          $timeout(function() {
            $scope.$apply('show_list = false');
          }, 200);
        });

        search_input.bind("keydown", function(event){
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
        var directions = {
          next: function(){
            hovered_index++;
            if($scope.items.length === hovered_index){ hovered_index = 0}
          },
          prev: function(){
            hovered_index--;
            if(0 > hovered_index){ hovered_index = $scope.items.length - 1}
          }
        };

        if(!$scope.items){return;}
        directions[direction]();
        $scope.hovered_item = $scope.items[hovered_index];
        console.log($scope.hovered_item)
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
        return $scope.selected_item;
      };
    }
  }
}]);

angular.module('Components').directive('asAutocompleteInput', [function(){
  return {
    restrict: "EAC",
    require: '^asAutocomplete',

    link: function(scope, iElement, iAttrs, asAutocompleteCtrl){
      var search_input = iElement.children('input');
      asAutocompleteCtrl.set_input(scope, search_input);
    }
  }
}]);


