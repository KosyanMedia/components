'use strict';

describe('Directive: as-tooltip', function () {

  beforeEach(module('Components'));

  var elm, scope;

  describe('contents', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      var content = $compile('<div id="test_elem" as-tooltip contents="<i>test</i>"></div>')(scope);
      $('body').append(content);
      scope.$digest();
    }));

    afterEach(function(){
      $('#test_elem').remove();
      $('.as_tooltip').remove();
    });

    it('adds tooltip with content at body bottom', function() {
      expect($('.as_tooltip').html()).toBe('<i class="ng-scope">test</i><div class="as_tooltip_arrow"></div>');
    });


    it('shows tooltip after click', function() {
      $('#test_elem').click();
      expect($('.as_tooltip')).toHaveClass('on');
    });

  });

  describe('closable', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      var content = $compile('<div id="test_elem" as-tooltip closable contents="<i>test</i>"></div>')(scope);
      scope = $rootScope.$new();
      $('body').append(content);
      scope.$digest();
    }));

    afterEach(function(){
      $('#test_elem').remove();
      $('.as_tooltip').remove();
    });

    it('adds close button', function() {
      expect($('.as_tooltip .as_tooltip_close').length).toBe(1);
    });

    it('closes tooltip after click', function() {
      $('#test_elem').click();
      expect($('.as_tooltip')).toHaveClass('on');
      $('.as_tooltip .as_tooltip_close').click();
      expect($('.as_tooltip')).not.toHaveClass('on');
    });
  });

  describe('closable by click outside', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      var content = $compile('<div id="test_elem" as-tooltip contents="<i>test</i>"></div>')(scope);
      scope = $rootScope.$new();
      $('body').append(content);
      scope.$digest();
    }));

    afterEach(function(){
      $('#test_elem').remove();
      $('.as_tooltip').remove();
    });

    it('can be closed by click outside tooltip', function() {
      $('#test_elem').click();
      expect($('.as_tooltip')).toHaveClass('on');
      $('body').click();
      expect($('.as_tooltip')).not.toHaveClass('on');
    });

    it('can not be closed by click inside tooltip', function() {
      $('#test_elem').click();
      expect($('.as_tooltip')).toHaveClass('on');
      $('.as_tooltip .tooltip-content__head').click();
      expect($('.as_tooltip')).toHaveClass('on');
    });
  });

  describe('contents', function(){
    var $httpBackend, $compile;

    beforeEach(inject(function ($rootScope, $injector) {
      elm = angular.element('<div as-tooltip contents="test.html"></div>');
      scope = $rootScope.$new();
      $httpBackend = $injector.get('$httpBackend');
      $compile = $injector.get('$compile');
      $httpBackend.when('GET', 'test.html').respond('<i>remote</i>');
    }));

    afterEach(function(){
      $('.as_tooltip').remove();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('fetches server when pass *.html contents', function(){
      $httpBackend.expectGET('test.html');
      $compile(elm)(scope);
      $httpBackend.flush();
    });

    it('sets tooltip content equal to *.html tempate', function(){
      $compile(elm)(scope);
      $httpBackend.flush();
      expect($('.as_tooltip').html()).toBe('<div class="as_tooltip_arrow"></div><i class="ng-scope">remote</i>');
    });

  });

});
