angular.module('Components').service('Offset', [function(){

  return {
    get_offset_sum: function(element){
      var top=0, left=0, origin = element;
      while(element) {
        top = top + parseInt(element.offsetTop);
        left = left + parseInt(element.offsetLeft);
        element = element.offsetParent;
      }

      return {
        top: top,
        left: left,
        width: origin.offsetWidth,
        height: origin.offsetHeight
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
      var origin = elem;
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
        width: origin.offsetWidth,
        height: origin.offsetHeight
      };
    },
    dock_to: function(dock, elem){
      var dock_offset = this.get_offset(dock);
      elem.css({
        left: dock_offset.left + 'px',
        top: dock_offset.top + dock_offset.height + 'px'
      });
    }
  };
}]);
