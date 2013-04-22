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

app.directive('asAutocomplete', ['$compile', 'Fetcher', 'Offset', function($compile, Fetcher, Offset){
  return {
    restrict: 'EAC',
    scope: {
      displayedAttr: '@',
      minLength: '@'
    },
    controller: function($scope, $element, $attrs){
      $scope.can_search = function(term){
        return !$scope.is_searching && term && term.length >= $scope.minLength && term !== $scope.last_search;
      }

      $scope.changed = function(term){
        if(!$scope.can_search(term)){ return; }
        $scope.is_searching = true;
        Fetcher.get(term, $scope.process_data);
      }

      $scope.is_selected = function(result){
        return result === $scope.selected_result;
      }

      $scope.process_data = function(data){
        $scope.is_searching = false;
        $scope.results = data;
      }

      $scope.result_selected = function(result){
        $scope.selected_result = result;
        $scope.last_search = $scope.searchTerm = result[$scope.displayedAttr];
      }

      $scope.$watch('searchTerm', $scope.changed);
    },
    link: function(scope, iElement, iAttrs, controller){
      var body = angular.element(document.body);
      scope.list_template = iElement.children('.as_autocomplete_results')[0];
      scope.results_list = $compile(scope.list_template)(scope);
      body.append(scope.results_list);

      var search_input = iElement.children('input')[0]
      var input_offset = Offset.get_offset(search_input);
      scope.results_list.css({
        left: input_offset.left + 'px',
        top: input_offset.top + input_offset.height + 'px'
      });
    }
  }
}]);

app.directive("focused", ['$compile', '$timeout', 'KeyCodes', function($compile, $timeout, KeyCodes) {
  return function(scope, iElement, iAttrs){
    iElement.bind('focus', function() {
      scope.$apply(iAttrs.focused + '=true');
    });
    iElement.bind('blur', function() {
      $timeout(function() {
          scope.$eval(iAttrs.focused + '=false');
      }, 100);
    });

    iElement.bind("keydown", function(event){
      switch(KeyCodes.get(event.keyCode)){
      case 'UP':
        break;
      case 'DOWN':
        break;
      case 'ENTER':
        break;
      case 'NUMPAD_ENTER':
        break;
      case 'ESCAPE':
        break;
      };
    });
  }
}]);
