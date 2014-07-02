angular.module('Components').directive('asAutocomplete',
  ['$injector', '$timeout', function($injector, $timeout){
  return {
    restrict: 'EAC',
    scope: {
      minLength: '@',
      acModel: '=acModel'
    },
    transclude: 'element',
    template: '<div ng-transclude>',
    replace: true,
    controller: ['$scope', '$element', '$timeout', '$attrs', function($scope, $element, $timeout, $attrs){
      $scope.is_searching = false;
      var
        fetcher = $injector.get($attrs.fetcher),

        can_search = function(term){
          return term && term.length >= $scope.minLength;
        },
        process_data = function(data){
          $scope.is_searching = false;
          $scope.show_list = true;
          $scope.results = data;
        },
        term_changed = function(term){
          $scope.show_list = false;
          if(!can_search(term)){ return; }
          $scope.is_searching = true;
          fetcher.get(term, process_data);
        },
        is_empty = function(obj) {
          if (obj == null) return true;
          if (angular.isArray(obj) || angular.isString(obj)) return obj.length === 0;
          for (var key in obj) if (obj.hasOwnProperty(key)) return false;
          return true;
        };

      this.scope = $scope;

      $scope.initial_value = angular.copy($scope.acModel);
      $scope.last_search = $scope.initial_value;

      $scope.$watch('acModel', function(new_value, old_value){
        if(!new_value){return;}
        $scope.last_search = angular.copy(new_value);
      }, true);

      this.sync_with_model = function(new_value){
        $scope.acModel = angular.copy(new_value);
      };

      this.set_items = function(items_scope){
        items_scope.$watch('selected_item', function(selected_item, b){
          if(!selected_item) return;
          $scope.last_search = selected_item;
          $scope.acModel = selected_item;
          $scope.results = [];
        });
      };

      this.set_input = function(input){
        $scope.input = input;

        var refresh_results = _.debounce(function(){
          $scope.results = [];
          term_changed(input.val());
        }, 200);

        input.bind('input', refresh_results);

        var userAgent = navigator.userAgent.toLowerCase(),
            ie_re = /.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/;

        if (/msie/.test(userAgent) && parseFloat((userAgent.match(ie_re) || [])[1]) < 9) {
          input.bind('keyup', refresh_results);
        }

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
      '<ul ng-style="suggest_style" class="as_autocomplete_results autocomplete-suggestions" ng-class="{on: show_list && items}">' +
        '<li ng-repeat="item in items" ng-click="item_selected()" ng-mouseenter="item_hovered(item)" ng-class="{highlight: is_hovered(item), group_label: is_group_label(item)}">' +
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
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
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

      $scope.is_group_label = function(item){
        return angular.isDefined(item) &&
          angular.isDefined($attrs.asAutocompleteItemGroup) &&
          !!item[$attrs.asAutocompleteItemGroup];
      };

      $scope.hovered_index = -1;
      $scope.show_list = true;

      $scope.bind_input = function(input){
        var body = angular.element(document.body);
        var window_elem = angular.element(window);
        body.append($element);

        $scope.suggest_style = {
          width: Offset.get_offset(input[0]).width
        };

        window_elem.bind('resize', function(){
          Offset.dock_to(input[0], $element);
        });

        input
          .bind('input', _.debounce(function(){
            Offset.dock_to(input[0], $element);
            $scope.$apply('hovered_index = -1');
          }, 200))
          .bind('focus', function(){
            Offset.dock_to(input[0], $element);
            $scope.$apply('show_list = true');
          })
          .bind('blur', function(){
            $scope.close(_.first($scope.items));
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
              event.preventDefault();
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'TAB':
              $scope.$apply(function(scope){ scope.item_selected() });
              break;
            case 'ESCAPE':
              $scope.close();
              break;
            }
          });
      };

      $scope.close = _.debounce(function(item){
        if($scope.is_group_label(item)){
          return;
        }
        $scope.$apply(function(){
          $scope.show_list = false;
          $scope.items = {};
          $scope.hovered_index = -1;
          $scope.prev_selected_item = $scope.selected_item;
          if(item){
            $scope.selected_item = item;
          }
        });
      }, 200);

      $scope.change_hovered = function(direction){
        if(!$scope.items){return;}
        directions[direction]();
      };

      $scope.is_hovered = function(item){
        return ($scope.items.indexOf(item) === $scope.hovered_index) && !$scope.is_group_label(item);
      };

      $scope.item_hovered = function(item){
        if($scope.is_group_label(item)){
          $scope.hovered_index = -1;
          return;
        }
        $scope.hovered_index = $scope.items.indexOf(item);
      };

      $scope.item_selected = function(){
        if(angular.isUndefined($scope.items)) return;
        var current_item = $scope.items[Math.max(0, $scope.hovered_index)];
        if($scope.is_group_label(current_item)){
          return;
        }
        $scope.selected_item = current_item;
        $scope.show_list = false;
				$scope.close();
      };

      $scope.reject_current_input = function(){
        $scope.selected_item = {};
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

      scope.$watch('search', _.debounce(function(new_value, old_value){
        asAutocompleteCtrl.sync_with_model(new_value);
        scope.$apply();
      }, 200), true);

      asAutocompleteCtrl.scope.$watch('last_search', function(last_search){
        scope.search = angular.copy(last_search);
      });

      scope.is_searching = function(){
        return asAutocompleteCtrl.scope.is_searching;
      };
    }
  }
}]);



