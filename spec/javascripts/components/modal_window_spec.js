describe('Directive: as-modal', function(){
  var $httpBackend, $compile, $rootScope;

  var body = angular.element(document.body);

  beforeEach(module('Components'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $compile = $injector.get('$compile');
  }));

  beforeEach(function(){
    $httpBackend.when('GET', 'test.html').respond('<i>response</i>');
    $httpBackend.expectGET('test.html');
  });

  describe('compile', function(){
    var modal_window, scope, content;
    beforeEach(function(){
      modal_window = angular.element("<div as-modal as-src='test.html' as-show='show'></div>");
      scope = $rootScope.$new();
      content = $compile(modal_window)(scope);
      body.append(content);
    });

    afterEach(function(){
      content.remove();
    });

    it('compiles lazy', function(){
      expect(content.html()).toEqual('');
      scope.show = true;
      scope.$digest();
      $httpBackend.flush();
      expect(content.html()).toContain('response');
    });

    it('compiles correctly', function(){
      scope.show = true;
      scope.$digest();
      $httpBackend.flush();
      expect(content[0].outerHTML).toMatch(/<div.*class=".*modal_wrapper.*".*><div.*class=".*modal_window.*">.*<\/div><\/div>/);
    });
    it('appends close button by default', function(){
      scope.show = true;
      scope.$digest();
      $httpBackend.flush();
      expect(content.html()).toMatch(/.*<div.*class=".*close_window.*".*><\/div>.*/);
    });
  });
  it('does NOT show close button if closable attribute set to false', function(){
    var modal_window = angular.element("<div as-modal as-src='test.html' closable='false' as-show='show'></div>");
    var scope = $rootScope.$new();
    var content = $compile(modal_window)(scope);
    body.append(content);
    scope.show = true;
    scope.$digest();
    $httpBackend.flush();
    expect(content.html()).toMatch(/.*<div.*class=".*close_window.*".*ng-show="false".*><\/div>.*/);
  });
});
