angular.module('Components').directive('asModal',
  ['$compile', '$timeout', '$http', '$templateCache',
  function($compile, $timeout, $http, $templateCache){
    return {
      restrict: 'EA',
      link: function(scope, element, attributes){

        attributes.closable = angular.isDefined(attributes.closable) ? attributes.closable : true;
        attributes.closeByClickBeyond =
          angular.isDefined(attributes.closeByClickBeyond) ? attributes.closeByClickBeyond : true;

        var
        body = angular.element(document.body),
        modal_window = angular.element("<div class='modal_window'>"),
        modal_wrapper_class = 'modal_wrapper',

        show_hide_window = function(show){
          if(show){
            compile_window();
            $timeout(function(){
              position_window();
            }, 10);
          }
        },

        position_window = function(){
          var left_offset = parseInt((window.innerWidth - modal_window.children().width()) / 2, 10),
            top_offset = parseInt((window.innerHeight - modal_window.children().height()) / 2, 10);

          top_offset = top_offset < 0 ? 20 : top_offset;

          modal_window.css({
            left: left_offset + "px",
            top: top_offset + "px"
          });
        },
        force_close = function(){
          if(angular.isDefined(attributes.ngHide)){
            scope.$apply(attributes.ngHide + '= true');
          } else {
            scope.$apply(attributes.ngShow + '= false');
          }
          scope.$eval(attributes.asExit);
        },

        compiled = false,
        compile_window = function(){
          if (compiled) return;
          element.addClass(modal_wrapper_class);

          var closer = angular.element("<div class='close_window' ng-show='" + attributes.closable + "'>");
          closer = $compile(closer)(scope);

          closer.bind('click', function(){
            force_close();
          });

          if(attributes.closeByClickBeyond){
            element.bind('click', function(event){
              var target = angular.element(event.target || event.srcElement);
              if(target.hasClass(modal_wrapper_class)){
                force_close();
              }
            });
          }

          $http.get(attributes.asSrc, {cache: $templateCache}).success(function(response){
          }).then(function(response){
            modal_window.append(response.data);
            modal_window.append(closer);
            modal_window = $compile(modal_window)(scope);
            element.append(modal_window);
          });
          compiled = true;
        };

        scope.$watch(attributes.ngShow, function(new_value, old_value){
          if (angular.isUndefined(new_value)) return;
          show_hide_window(new_value);
        });

        scope.$watch(attributes.ngHide, function(new_value, old_value){
          if (angular.isUndefined(new_value)) return;
          show_hide_window(!new_value);
        });
      }
    };
  }
]);
