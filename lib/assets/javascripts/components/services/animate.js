angular.module('Components').service('Animate', ['$timeout', function($timeout){

  return {
    do_animate: function(options) {
      var start = new Date;
      var do_step = function(){
        $timeout(function(){
          var progress = (new Date - start) / options.duration;
          if (progress > 1) progress = 1;
          options.step(progress);
          if (progress !== 1) {
            do_step();
            return;
          }
          if(options.callback) options.callback();
        }, options.delay || 10);
      };
      do_step();
    },
    animate: function(element, properties, duration, callback) {
      this.do_animate({
        duration: duration,
        step: function(progress) {
          for(var property in properties){
            var prop = properties[property],
              values = prop.values,
              measurement = prop.measurement || "",
              step = progress * (values[1] - values[0]);
            element.style[property] = (values[0] + step) + measurement;
          }
        },
        callback: callback
      });
    }
  };
}]);
