angular.module('Components').directive('asModal',
  ['$compile', '$http', '$templateCache', '$timeout',
    function($compile, $http, $templateCache, $timeout){
      return {
        restrict: 'EA',
        link: function(scope, element, attributes, controller){

          var
          inner_scope = scope.$new(),
          click_in_window = false,

          body = angular.element(document.body),
          modal_wrapper = angular.element("<div/>")
            .addClass(controller.options.modal_wrapper_class)
            .addClass('animate-if')
            .attr('ng-show', attributes.asShow)
            .attr('ng-click', 'click_beyond()'),
          modal_window = angular.element("<div/>")
            .addClass(controller.options.modal_window_class)
            .attr('ng-style', 'modal_window_offset()')
            .attr('ng-click', 'window_click()'),
          modal_closer = angular.element("<div/>")
            .addClass("close_window")
            .attr('ng-show', controller.options.closable)
            .attr('ng-click', 'close_window()'),

          force_close_window = function(){
            scope.$eval(attributes.asShow + ' = false');
          };


          inner_scope.modal_window_offset = function(){

            //TODO: it calls too many times. optimize it

            var mw = element.find('.' + controller.options.modal_window_class)[0];

            var window_width = window.innerWidth || document.documentElement.clientWidth,
              window_height = window.innerHeight || document.documentElement.clientHeight;

            var children_height = mw.clientHeight;
            var children_width = mw.clientWidth;

            var left_offset = parseInt((window_width - children_width) / 2, 10),
              top_offset = parseInt((window_height - children_height) / 2, 10);

            top_offset = top_offset < 20 ? 20 : top_offset;

            return {
              left: left_offset,
              top: top_offset
            };
          };

          inner_scope.close_window = function(){
            force_close_window();
          };

          inner_scope.click_beyond = function(){
            if(!click_in_window && attributes.closeByClickBeyond === 'true'){
              force_close_window();
            }
            click_in_window = false;
          };

          inner_scope.window_click = function(){
            click_in_window = true;
          };

          inner_scope.$watch(attributes.asShow, function(new_value){
            if(new_value){
              angular.element('html').addClass('scroll-forbidden');
              $timeout(function(){
                $(window).resize();
              }, 300);
            } else {
              angular.element('html').removeClass('scroll-forbidden');
            }
          });

          controller.compile_window = function(){

            $http.get(attributes.asSrc, {cache: $templateCache}).then(function(response){
              modal_wrapper.append(modal_window);
              modal_window.append(response.data);
              modal_window.append(modal_closer);
              element.append($compile(modal_wrapper)(inner_scope));
            });

            controller.compile_window = function(){
              return;
            };
          };
        },
        controller: ['$scope', '$element', '$attrs', function(scope, element, attrs){

          var self = this;

          this.options = {
            closable: attrs.closable || true,
            close_by_click_beyond: attrs.closeByClickBeyond || true,
            modal_wrapper_class: attrs.modalWrapperClass || 'modal_wrapper',
            modal_window_class: attrs.modalWindowClass || 'modal_window'
          };

          scope.$watch(attrs.asShow, function(new_value){
            if(angular.isUndefined(new_value) || !new_value) return;
            self.compile_window();
          });
        }]
      };
    }
]);
