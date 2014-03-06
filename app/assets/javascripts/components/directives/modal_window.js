angular.module('Components').directive('asModal',
  ['$compile', '$http', '$templateCache', '$timeout',
    function($compile, $http, $templateCache, $timeout){
      return {
        restrict: 'EA',
        link: function(scope, element, attributes, controller){

          var
          inner_scope = scope.$new(),
          click_in_window = false,

          modal_wrapper = angular.element("<div/>")
            .addClass(controller.options.modal_wrapper_class)
            .addClass('animate-show')
            .attr('ng-show', attributes.asShow)
            .attr('ng-click', 'click_beyond()'),
          modal_window = angular.element("<div/>")
            .addClass(controller.options.modal_window_class)
            .attr('ng-click', 'window_click()'),
          modal_closer = angular.element("<div/>")
            .addClass("close_modal_window")
            .attr('ng-show', controller.options.closable)
            .attr('ng-click', 'close_window()'),

          force_close_window = function(){
            scope.$eval(attributes.asShow + ' = false');
					},

					set_window_offset = function(){
						var window_height = window.innerHeight || document.documentElement.clientHeight,
							children_height = modal_window.height(),
							top_offset = parseInt((window_height - children_height) / 2, 10);

						top_offset = top_offset < 20 ? 20 : top_offset;
						modal_window.css('top', top_offset + 'px');
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
							$(window).on('resize', set_window_offset);
              angular.element('html').addClass('scroll-forbidden');
              $timeout(function(){
                $(window).resize();
              }, 10);
            } else {
							$(window).off('resize', set_window_offset);
              angular.element('html').removeClass('scroll-forbidden');
            }
          });

          controller.compile_window = function(){

						var cached_template = $templateCache.get(attributes.asSrc);

						modal_wrapper.append(modal_window);
						modal_window.append(cached_template);
						modal_window.append(modal_closer);
						element.append($compile(modal_wrapper)(inner_scope));

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
