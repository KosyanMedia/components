angular.module('Components').service('Fetcher', ['$http', function($http){
  return {
    get: function(iata, success_callback){
      $http.get('http://www.jetradar.com/autocomplete/places?q=' + iata)
        .success(success_callback);
    }
  }
}]);

angular.module('Components').directive('asAutocomplete', ['$compile', '$timeout', 'Fetcher', 'KeyCodes', 'Offset', function($compile, $timeout, Fetcher, KeyCodes, Offset){
  return {
    restrict: 'EAC',
    scope: {
      displayedAttr: '@',
      minLength: '@'
    },
    controller: function($scope, $element, $attrs){
      $scope.hovered_index = -1;

      $scope.can_search = function(term){
        return !$scope.is_searching && term && term.length >= $scope.minLength && term !== $scope.last_search;
      }

      $scope.change_hovered = function(direction){
        var directions = {
          next: function(){
            $scope.hovered_index++;
            if($scope.results.length === $scope.hovered_index){ $scope.hovered_index = 0}
          },
          prev: function(){
            $scope.hovered_index--;
            if(0 > $scope.hovered_index){ $scope.hovered_index = $scope.results.length - 1}
          }
        };

        if(!$scope.results){return;}
        directions[direction]();
        $scope.hovered_result = $scope.results[$scope.hovered_index];
      }

      $scope.is_hovered = function(result){
        return result === $scope.hovered_result;
      }

      $scope.process_data = function(data){
        $scope.is_searching = false;
        $scope.results = data;
        $scope.show_list = true;
      }

      $scope.result_hovered = function(result){
        $scope.hovered_result = result;
        $scope.hovered_index = $scope.results.indexOf(result);
      }

      $scope.result_selected = function(result){
        $scope.selected_result = result;
        $scope.last_search = $scope.searchTerm = result[$scope.displayedAttr];
        $scope.show_list = false;
      }

      $scope.term_changed = function(term){
        if(!$scope.can_search(term)){ return; }
        $scope.is_searching = true;
        $scope.hovered_index = -1;
        Fetcher.get(term, $scope.process_data);
      }

      $scope.$watch('searchTerm', $scope.term_changed);
    },
    link: function(scope, iElement, iAttrs, controller){
      var body = angular.element(document.body);
      scope.list_template = iElement.children('.as_autocomplete_results')[0];
      scope.results_list = $compile(scope.list_template)(scope);
      body.append(scope.results_list);

      var search_input = iElement.children('input')
      var input_offset = Offset.get_offset(search_input[0]);
      scope.results_list.css({
        left: input_offset.left + 'px',
        top: input_offset.top + input_offset.height + 'px'
      });

      search_input.bind('focus', function() {
        scope.$apply('show_list = true');
      });

      search_input.bind('blur', function() {
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


