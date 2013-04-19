describe('Service: Offset', function() {
  var child_element, parent_element;
  parent_element = angular.element('<div/>');
  child_element = angular.element('<div/>');

  beforeEach(function() {
    module('Components');
    inject(function($rootScope, $compile) {
      var scope = $rootScope.$new();
      parent_element.css({
        "position": "absolute",
        "top": "20px",
        "left": "30px",
        "width": "40px",
        "height": "50px"
      });
      child_element.css({
        "marginLeft": "10px",
        "marginTop": "5px",
        "width": "10px",
        "height": "10px"
      });
      angular.element(document.body).append(parent_element);
      $compile(parent_element)(scope);
      angular.element(parent_element).append(child_element);
      $compile(child_element)(scope);
    });
  });

  afterEach(function() {
    parent_element.remove();
  });

  it('should get parent offset', inject(function(Offset) {
    var offset;
    offset = Offset.get_offset(parent_element[0]);
    expect(offset.top).toBe(20);
    expect(offset.left).toBe(30);
    expect(offset.width).toBe(40);
    expect(offset.height).toBe(50);
  }));

  it('should get child offset', inject(function(Offset) {
    var offset;
    offset = Offset.get_offset(child_element[0]);
    expect(offset.top).toBe(25);
    expect(offset.left).toBe(40);
  }));
});
