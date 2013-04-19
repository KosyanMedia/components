'use strict';

describe('Directive: as-odometer', function () {

  beforeEach(module('Components'));

  var elm, scope;

  describe('contents', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.delta = 0;

      var odo_template =
        '<div id="test_elem">' +
        '<div as-odometer="2+3+delta" as-duration="500"></div>' +
        '</div>';
      var content = $compile(odo_template)(scope);
      $('body').append(content);
      scope.$digest();
    }));

    afterEach(function(){
      $('#test_elem').remove();
    });

    it('compiles odometer with correct initial value', function() {
      expect($('#test_elem div').html()).toBe('5');
    });

    it('inserts all intermediate values', function(){
      runs(function(){
        scope.delta = 5;
        scope.$digest();
      });
      runs(function(){
        expect($('#test_elem div div').length).toBe(5);
      });
    });

    it('changes value asyncronously', function() {
      runs(function(){
        scope.delta = 5;
        scope.$digest();
      });

      waits(600);

      runs(function(){
        expect($('#test_elem div').html()).toBe('10');
      });
    });
  });
});
