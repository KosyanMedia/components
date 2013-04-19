describe('Service: Animate', function() {

  beforeEach(function(){
    module('Components');
  });

  describe('Unit Tests', function(){
    it('callback successfuly called', inject(function(Animate, $timeout){
      var completed = false;
      runs(function(){
        Animate.do_animate({
          duration: 100,
          step: function() {},
          callback: function(){
            completed = true;
          }
        });
      });
      waitsFor((function(){
        $timeout.flush();
        return completed === true;
      }), "callback did not called yet", 1000);
      runs(function(){
        expect(completed).toBeTruthy();
      });
    }));

    it('progress change from 0 to 1', inject(function(Animate, $timeout){
      var completed = false;
      var progress_values = [];
      runs(function(){
        Animate.do_animate({
          duration: 100,
          step: function(progress) {
            progress_values.push(progress);
          },
          callback: function(){
            completed = true;
          }
        });
      });
      waitsFor((function(){
        $timeout.flush();
        return completed === true;
      }), "progress did not changed yet", 1000);
      runs(function(){
        var first_element = progress_values[0],
          last_element = progress_values[progress_values.length - 1],
          middle_element = progress_values[parseInt(progress_values.length / 2, 10)];
        expect(first_element).toBe(0);
        expect(middle_element).toBeGreaterThan(0);
        expect(middle_element).toBeLessThan(1);
        expect(last_element).toBe(1);
      });
    }));
  });

  describe('e2e tests', function(){

    var animated_element = angular.element('<div/>');

    beforeEach(function(){
      inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        animated_element.css({
          "position": "absolute",
          "top": "20px",
          "left": "30px"
        });
        angular.element(document.body).append(animated_element);
        $compile(animated_element)(scope);
      });
    });

    afterEach(function(){
      animated_element.remove();
    });

    it('element should moving', inject(function(Animate, $timeout){
      var completed = false;
      runs(function(){
        Animate.animate(animated_element[0], {
          "left": {
            "values": [30, 100],
            "measurement": "px"
          },
          "top": {
            "values": [20, 200],
            "measurement": "px"
          }
        }, 500, function(){
          completed = true;
        });
      });
      waitsFor((function(){
        $timeout.flush();
        return completed === true;
      }), "element did not move yet", 1000);
      runs(function(){
        expect(animated_element[0].offsetTop).toBe(200);
        expect(animated_element[0].offsetLeft).toBe(100);
      });
    }));

    it('element should change opacity', inject(function(Animate, $timeout){
      var completed = false;
      runs(function(){
        Animate.animate(animated_element[0], {
          "opacity": {
            "values": [0.1, 0.8]
          }
        }, 500, function(){
          completed = true;
        });
      });
      waitsFor((function(){
        $timeout.flush();
        return completed === true;
      }), "element did not change opacity yet", 1000);
      runs(function(){
        expect(animated_element[0].style.opacity).toBe("0.8");
      });
    }));
  });

});
