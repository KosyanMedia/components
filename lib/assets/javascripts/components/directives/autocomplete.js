var app = angular.module('Autocomplete', []);

app.service('Offset', [function(){
  return {
    get_offset_sum: function(element){
      var top=0, left=0, oririn = element;
      while(element) {
        top = top + parseInt(element.offsetTop);
        left = left + parseInt(element.offsetLeft);
        element = element.offsetParent;
      }

      return {
        top: top,
        left: left,
        width: oririn.offsetWidth,
        height: oririn.offsetHeight
      };
    },
    get_offset: function(elem) {
      if (elem.getBoundingClientRect) {
        return this.get_offset_rect(elem);
      } else {
        return this.get_offset_sum(elem);
      }
    },
    get_offset_rect: function(elem) {
      var oririn = elem;
      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docElem = document.documentElement;

      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return {
        top: Math.round(top),
        left: Math.round(left),
        width: oririn.offsetWidth,
        height: oririn.offsetHeight
      };
    }
  };
}]);

app.service('Fetcher', ['$http', function($http){
  return {
    get: function(iata, success_callback){
      $http.get('http://www.jetradar.com/autocomplete/places?q=' + iata)
        .success(success_callback);
    }
  }
}]);

app.directive('asAutocomplete', ['$compile', 'Fetcher', 'Offset', function($compile, Fetcher, Offset){
  return {
    restrict: 'EAC',
    scope: {
      minLength: '@'
    },
    controller: function($scope, $element, $attrs){
      $scope.can_search = function(term){
        return !$scope.is_searching && term && term.length >= $scope.minLength
      }

      $scope.changed = function(term){
        if(!$scope.can_search(term)){ return; }
        $scope.is_searching = true;
        Fetcher.get(term, $scope.process_data);
      }

      $scope.process_data = function(data){
        $scope.is_searching = false;
        $scope.results = data;
        $scope.results_list = $compile($scope.list_template)($scope);
      }

      $scope.result_selected = function(result){
        $scope.search_term = result;
      }

      $scope.$watch('searchTerm', $scope.changed);
    },
    link: function(scope, iElement, iAttrs, controller){
      scope.list_template =
        '<ul class="as_autocomplete_results" ng-class="{on: focused && results}">' +
          '<li ng-repeat="result in results" ng-click="result_selected(result)">' +
            '{{ result.name}} {{result.city_name}}' +
          '</li>' +
        '</ul>'

      scope.results_list = $compile(scope.list_template)(scope);

      var body = angular.element(document.body);
      body.append(scope.results_list);

      var search_input = iElement.children('input')
      var input_offset = Offset.get_offset(search_input[0]);

      scope.results_list.css({
        left: input_offset.left + 'px',
        top: input_offset.top + input_offset.height + 'px'
      });
    }
  }
}]);

app.directive("focused", function($timeout) {
  return function(scope, iElement, iAttrs) {
    iElement.bind('focus', function() {
      scope.$apply(iAttrs.focused + '=true');
    });
    iElement.bind('blur', function() {
      $timeout(function() {
          scope.$eval(iAttrs.focused + '=false');
      }, 100);
    });
    scope.$eval(iAttrs.focused + '=true')
  }
});
