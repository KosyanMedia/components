angular.module('Components').service('Offset', [function(){

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
