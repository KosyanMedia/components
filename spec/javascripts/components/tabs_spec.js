'use strict';

describe('Directive: as-tabs', function () {

  beforeEach(module('Components'));

  var elm, scope;

  describe('contents', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();

      var tabs_template =
        '<div id="test_elem"><tabs>' +
          '<pane title="Pane1">Pane1content</pane>' +
          '<pane title="Pane2">Pane2content</pane>' +
        '</tabs></div>';
      var content = $compile(tabs_template)(scope);
      $('body').append(content);
      scope.$digest();
    }));

    afterEach(function(){
      $('#test_elem').remove();
    });

    it('compiles tabs', function() {
      expect($('#test_elem .nav-tabs li').length).toBe(2);
    });

    it('inserts data', function() {
      expect($('#test_elem .tab-pane:eq(0) span').text()).toBe('Pane1content');
    });

  });
});
