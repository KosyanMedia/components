var app = angular.module('Autocomplete', []);

app.service('KeyCodes', [function(){
  var key_codes = {
    8: "BACKSPACE",
    9: "TAB",
    13: "ENTER",
    16: "SHIFT",
    17: "CONTROL",
    18: "ALT",
    20: "CAPS_LOCK",
    27: "ESCAPE",
    32: "SPACE",
    33: "PAGE_UP",
    34: "PAGE_DOWN",
    35: "END",
    36: "HOME",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    45: "INSERT",
    46: "DELETE",
    91: "WINDOWS",
    93: "MENU",
    106: "NUMPAD_MULTIPLY",
    107: "NUMPAD_ADD",
    108: "NUMPAD_ENTER",
    109: "NUMPAD_SUBTRACT",
    110: "NUMPAD_DECIMAL",
    111: "NUMPAD_DIVIDE",
    188: "COMMA",
    190: "PERIOD"
  };
  return {
    get: function(keycode){
      return key_codes[keycode] || "TYPE";
    }
  };
}]);

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

app.directive('asAutocomplete', ['$compile', '$timeout', 'Fetcher', 'KeyCodes', 'Offset', function($compile, $timeout, Fetcher, KeyCodes, Offset){
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

      $scope.changed = function(term){
        if(!$scope.can_search(term)){ return; }
        $scope.is_searching = true;
        $scope.hovered_index = -1;
        Fetcher.get(term, $scope.process_data);
      }

      $scope.is_hovered = function(result){
        return result === $scope.hovered_result;
      }

      $scope.process_data = function(data){
        $scope.is_searching = false;
        $scope.results = data;
      }

      $scope.result_selected = function(result){
        $scope.selected_result = result;
        $scope.last_search = $scope.searchTerm = result[$scope.displayedAttr];
        $scope.show_list = false;
      }

      $scope.change_hovered = function(direction){
        if(!$scope.results){return;}

        if(direction === 'down'){
          $scope.hovered_index++;
          if($scope.results.length === $scope.hovered_index){ $scope.hovered_index = 0}

        } else {
          $scope.hovered_index--;
          if($scope.hovered_index < 0){ $scope.hovered_index = $scope.results.length - 1}
        }

        $scope.hovered_result = $scope.results[$scope.hovered_index];
      }

      $scope.result_hovered = function(result){
        $scope.hovered_result = result;
        $scope.hovered_index = $scope.results.indexOf(result);
      }

      $scope.$watch('searchTerm', $scope.changed);
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
          scope.$apply(function(scope){ scope.change_hovered('up') });
          break;
        case 'DOWN':
          scope.$apply(function(scope){ scope.change_hovered('down') });
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
        };
      });
    }
  }
}]);


