angular.module('Components').
  directive('asOdometer', function(){

    var scrollTo = function (element, to, duration, callback) {
      if (duration <= 0){
        if(angular.isFunction(callback)){
          callback();
        }
        return;
      }

      var difference = to - element.scrollTop;
      var per_tick = difference / duration * 10;
      setTimeout(function(){
          element.scrollTop = element.scrollTop + per_tick;
          scrollTo(element, to, duration - 10, callback);
      }, 10);
    };

    return {
      restrict: 'AC',
      link: function(scope, iElement, iAttrs, controller){
        var duration = iAttrs.asDuration || 300;

        scope.$watch(iAttrs.asOdometer, function(new_val, old_val){
          if (old_val === new_val){
            iElement.html(new_val);
            return;
          }

          var i = 0, next_val = old_val+1;
          for(i=next_val; i<=new_val; i=i+1){
            iElement.append('<div>' + i + '</div>');
          }

          var wrapper = iElement[0];
          var scroll_height = Math.max(wrapper.scrollHeight, wrapper.clientHeight) - wrapper.clientHeight;
          scrollTo(wrapper, scroll_height, duration, function(){
            iElement.html(new_val);
            wrapper.scrollTop = 0;
          });
        });
      }
    };
  });
