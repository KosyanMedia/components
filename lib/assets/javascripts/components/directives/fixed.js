angular.module('Components').directive('asFixed', function(){

  return {
    restrict: 'AC',
    link: function(scope, iElement, iAttrs, controller){
      var elm = angular.element(iElement[0]),
        trigger;

      var stub_stripe = angular.element('<div/>');
      angular.element(window).bind('scroll', function(event){
        stub_stripe.css({
          "height": "35px",
          "width": "100%"
        });
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        if(scroll <= 0){
          trigger = false;
          stub_stripe.remove();
          elm.removeClass('upper_stripe--fixed');
        } else if (!trigger) {
          trigger = true;
          angular.element(document.body).prepend(stub_stripe);
          elm.addClass('upper_stripe--fixed');
        }
      });
    }
  };
});
