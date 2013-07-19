angular.module('Components').directive('asTooltip',
  ['$http', '$templateCache', '$compile', '$timeout', 'Offset',
    function($http, $templateCache, $compile, $timeout, Offset){
      return {
        restrict: 'EAC',
        link: function(scope, iElement, iAttrs, controller) {

          var body = angular.element(document.body),
            tip = angular.element('<div class="as_tooltip"></div>'),
            opened = false,
            close_tooltip = function(){
              tip.removeClass('on');
              opened = false;
            },
            insert_content = function(content){
              content = $compile(content)(scope);
              tip.append(content);
            };

          if(/\.html$/.test(iAttrs.contents)){

            $http.get(iAttrs.contents, {
              cache: $templateCache
            }).then(function(responce){
              insert_content(responce.data);
            });

          } else {
            insert_content(iAttrs.contents);
          }

          var arrow = angular.element('<div class="as_tooltip_arrow"></div>');
          tip.append(arrow);

          body.bind('click', function(event){
            var target = angular.element(event.target || event.srcElement);
            var is_tooltip_child = function(element) {
              if (!element || element.length < 1) {
                return false;
              }

              return element.hasClass('as_tooltip') || is_tooltip_child(element.parent());
            };

            if (opened && !is_tooltip_child(target)) {
              close_tooltip();
            }
          });

          if(angular.isDefined(iAttrs.closable)){
            var closer = angular.element('<div class="as_tooltip_close"></div>');
            closer.bind('click', close_tooltip);
            tip.append(closer);
          }

          body.append(tip);

          iElement.bind("click", function(e) {
            var left, target, top, raw_tip, tip_offset, elem_offset;
            target = e.target || e.srcElement;
            tip.addClass('on');
            opened = true;
            elem_offset = Offset.get_offset(target);
            tip_offset = Offset.get_offset(tip[0]);
            raw_tip = tip[0];

            left = elem_offset.left + elem_offset.width / 2 - tip_offset.width / 2;
            if(left < 0){
              left = 0;
            }
            top = elem_offset.top + elem_offset.height + 15;
            if (top < 0){
              top = 0;
            }

            if(left === 0){
              arrow.css({
                left: elem_offset.left + elem_offset.width / 2
              });
            }

            tip.css({
              left: left + 'px',
              top: top + 'px'
            });
            e.stopPropagation();
          });

          var scroll = 0;
          var align_tip = (function(){
            var promise = null;
            return function(){
              promise && $timeout.cancel(promise);
              promise = $timeout(function(){
                var elem_offset = Offset.get_offset(iElement[0]);
                tip.css('top', elem_offset.top + elem_offset.height + 15 + 'px');
              }, 150);
            }
          }());
          angular.element(window).bind('scroll', align_tip);
        }
      };
    }]);
