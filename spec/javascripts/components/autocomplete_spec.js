'use strict';

describe('Directive: as-autocomplete', function () {

    angular.module('Components').service('TestRadarPlacesFetcher', ['$http', function($http){
      var results = {
        lon: [
          {
            city_name: "London",
            code: "LON",
            country_name: "United Kingdom",
            name: "All airports",
            title: "London"
          },
          {
            city_name: "London",
            code: "LHR",
            country_name: "United Kingdom",
            name: "Heathrow",
            title: "Heathrow"
          },
          {
            city_name: "London",
            code: "LGW",
            country_name: "United Kingdom",
            name: "Gatwick",
            title: "Gatwick"
          },
          {
            city_name: "London",
            code: "LCY",
            country_name: "United Kingdom",
            name: "London City Airport",
            title: "London City Airport"
          }
        ]}
      return {
        get: function(iata, success_callback){
          success_callback(results[iata]);
        }
      }
    }]);

  beforeEach(module('Components'));
  beforeEach(function(){
    loadFixtures('test.html');
  });
});
