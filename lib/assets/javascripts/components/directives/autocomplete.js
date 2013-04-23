angular.module('Components').directive('asAutocomplete', ['$compile', '$injector', '$timeout', 'KeyCodes', 'Offset', function($compile, $injector, $timeout, KeyCodes, Offset){
  return {
    restrict: 'EAC',
    scope: {
      displayedAttr: '@',
      minLength: '@'
    },
    controller: function($scope, $element, $attrs){
      var hovered_index = -1,

        fetcher = $injector.get($attrs.fetcher),

        is_searching = false,

        can_search = function(term){
          return !is_searching && term && term.length >= $scope.minLength && term !== $scope.last_search;
        },

        process_data = function(data){
          is_searching = false;
          $scope.results = data;
          $scope.show_list = true;
        },

        term_changed = function(term){
          if(!can_search(term)){ return; }
          is_searching = true;
          $scope.hovered_index = -1;
          fetcher.get(term, process_data);
        }

      $scope.change_hovered = function(direction){
        var directions = {
          next: function(){
            hovered_index++;
            if($scope.results.length === hovered_index){ hovered_index = 0}
          },
          prev: function(){
            hovered_index--;
            if(0 > hovered_index){ hovered_index = $scope.results.length - 1}
          }
        };

        if(!$scope.results){return;}
        directions[direction]();
        $scope.hovered_result = $scope.results[hovered_index];
      }

      $scope.is_hovered = function(result){
        return result === $scope.hovered_result;
      }

      $scope.result_hovered = function(result){
        $scope.hovered_result = result;
        hovered_index = $scope.results.indexOf(result);
      }

      $scope.result_selected = function(result){
        $scope.selected_result = result;
        $scope.last_search = $scope.searchTerm = result[$scope.displayedAttr];
        $scope.show_list = false;
      }

      $scope.$watch('searchTerm', term_changed);
    },
    link: function(scope, iElement, iAttrs, controller){
      var body = angular.element(document.body);

      var list_template = iElement.children('.as_autocomplete_results')[0];
      var results_list = $compile(list_template)(scope);
      body.append(results_list);

      var search_input = iElement.children('input');
      Offset.dock_to(search_input[0], results_list);

      search_input.bind('focus', function(){
        scope.$apply('show_list = true');
      });

      search_input.bind('blur', function(){
        $timeout(function() {
          scope.$apply('show_list = false');
        }, 200);
      });

      search_input.bind("keydown", function(event){
        switch(KeyCodes.get(event.keyCode)){
        case 'UP':
          scope.$apply(function(scope){ scope.change_hovered('prev') });
          break;
        case 'DOWN':
          scope.$apply(function(scope){ scope.change_hovered('next') });
          break;
        case 'ENTER':
          scope.$apply(function(scope){ scope.result_selected(scope.hovered_result) });
          break;
        case 'NUMPAD_ENTER':
          scope.$apply(function(scope){ scope.result_selected(scope.hovered_result) });
          break;
        case 'ESCAPE':
          scope.$apply('show_list = false');
          break;
        }
      });
    }
  }
}]);


