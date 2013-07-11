angular.module('Components').directive('asModal', ['$compile', function($compile){
  return {
    restrict: 'EA',
    scope: {
      asShow: '=asShow',
      asSrc: '@asSrc'
    },
    link: function(scope, element, attributes, controller){

      var parent_scope = scope.$parent;

      var body = angular.element(document.body);

      var show_hide_window = function(show){
        scroll(0, 0);
        if(show){
          element.css("display", "block");
          position_window();
          body.css("overflow", "hidden");
        } else {
          element.css("display", "none");
          body.css("overflow", "auto");
        }
      };

      var position_window = function(){
        var left_offset = parseInt((body.width() - modal_window.children().width()) / 2, 10),
          top_offset = parseInt((body.height() - modal_window.children().height()) / 2, 10);

        top_offset = top_offset < 0 ? 20 : top_offset;
        modal_window.css({
          left: "#{left_offset}px",
          top: "#{top_offset}px"
        });
      };


      element.addClass('modal_wrapper');

      var modal_window = angular.element("<div class='modal_window' ng-include src=\"'" + attributes.asSrc + "'\">");
      modal_window = $compile(modal_window)(parent_scope);

      element.append(modal_window);

      show_hide_window(scope.asShow);

      scope.$watch('asShow', function(new_value, old_value){
        show_hide_window(new_value);
      });
    }
  };
}]);
