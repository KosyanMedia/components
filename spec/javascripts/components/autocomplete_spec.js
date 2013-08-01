'use strict';

describe('Directive: as-autocomplete', function () {

    var elm, scope, content;
    var template = '<as-autocomplete min-length="3" fetcher="TestRadarPlacesFetcher" ac-model="model">' +
                      '<as-autocomplete-item>' +
                        '{{item.name}} {{item.city_name}}' +
                      '</as-autocomplete-item>' +
                      '<as-autocomplete-input id="ac-input">' +
                        '<input type="text" id="title" placeholder="Origin" ng-model="search.title"/>' +
                        '<input type="text" id="code" ng-model="search.code"/>' +
                      '</as-autocomplete-input>' +
                    '</as-autocomplete>';


    angular.module('Components').service('TestRadarPlacesFetcher', ['$http', function($http){
      var results = {
        lon: [{
            code: "LON",
            title: "London"
          }, {
            code: "LHR",
            title: "Heathrow"
          }, {
            code: "LGW",
            title: "Gatwick"
          }, {
            code: "LCY",
            title: "London City Airport"
          }
        ],
        mow: [{
            code: "MOW",
            title: "Moscow"
        }]};
      return {
        get: function(iata, success_callback){
          success_callback(results[iata]);
        }
      }
    }]);

  beforeEach(module('Components'));

  describe('contents', function(){
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.model = {'title': 'MyTitle', 'code': 'MyCode'};
      content = $compile(template)(scope);
      scope.$digest();
    }));

    it('fills from ac-model', function() {
      expect(content.find('#title').val()).toBe('MyTitle');
      expect(content.find('#code').val()).toBe('MyCode');
    });

    it('binds to ac-model', function() {
      scope.model = {'title': 'MyTitle1', 'code': 'MyCode1'};
      scope.$digest();
      expect(content.find('#title').val()).toBe('MyTitle1');
      expect(content.find('#code').val()).toBe('MyCode1');
    });

    it('shows suggest', function() {
      content.find('#title').val('lon');
      content.find('#title').trigger('input');
      var inner_scope = content.find('#title').scope();

      expect(inner_scope.items.length).toBe(4);
      expect(inner_scope.show_list).toBe(true);
    });

    it('filters using fetcher', function() {
      content.find('#title').val('mow');
      content.find('#title').trigger('input');
      var inner_scope = content.find('#title').scope();

      expect(inner_scope.items.length).toBe(1);
    });

    it('inserts value from suggest list', function() {
      content.find('#title').val('lon');
      content.find('#title').trigger('input');
      var inner_scope = content.find('#title').scope();

      inner_scope.hovered_index = 1;
      inner_scope.item_selected();
      scope.$digest();

      expect(content.find('#title').val()).toBe('Heathrow');
      expect(content.find('#code').val()).toBe('LHR');
    });
  });
});
