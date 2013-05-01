// This pulls in all your specs from the javascripts directory into Jasmine:
//
// spec/javascripts/*_spec.js.coffee
// spec/javascripts/*_spec.js
// spec/javascripts/*_spec.js.erb
// IT IS UNLIKELY THAT YOU WILL NEED TO CHANGE THIS FILE
//
//= require angular
//= require application
//= require angular-mocks
//= require_tree ./
//= require jquery

angular.module('Components').
  constant('Preferences', {
    user_session_id: '4402aa688937824968c2984c208e82c3',
    user_info_url: 'http://localhost:3000/current_user.json?user_session_id=4402aa688937824968c2984c208e82c3',
    achievemets_url: 'http://localhost:3000/reached_user_achievements.json'
  }).
  run(['$templateCache', function($templateCache){
    $templateCache.put('aviaforce.html', '<div ng-controller=\"AviaforceCtrl\">\n  <div class=\"tooltip-content\">\n    <div ng-controller=\"AuthenticationCtrl\">\n      <div class=\"tooltip-content__head\">\n        <div class=\"tooltip-content__head-userpic\">\n          <img ng-src=\"{{user.image}}\" alt=\"Avatar\" src=\"http://localhost:3000//assets/userpic_anonymous.png\" />\n        <\/div>\n        <div class=\"tooltip-content__head-greeting\">\n          <div class=\"tooltip-content__head-greeting-name\">Здравствуй, <span ng-bind=\"user.name || \'юный падаван\'\">юный падаван<\/span>!<\/div>\n          <div class=\"tooltip-content__head-greeting-info\" ng-hide=\"user.is_signed_in()\">Авторизуйся и копи авиасилу!<\/div>\n        <\/div>\n        <div class=\"tooltip-content__head-aviaforce-count\">\n          <div class=\"tooltip-content__head-aviaforce-count-text\">У тебя <span>{{reached_points()}}<\/span> авиасил<\/div>\n        <\/div>\n      <\/div>\n      <div class=\"tooltip-content__auth\" ng-hide=\"user.is_signed_in()\">\n        <div class=\"tooltip-content__auth-button tooltip-content__auth-button-facebook\" ng-click=\"login_with(\'http://localhost:3000/users/auth/facebook\')\">\n          <div class=\"tooltip-content__auth-button-img\"><\/div>\n          <div class=\"tooltip-content__auth-button-label\">Войти через Facebook<\/div>\n        <\/div>\n        <div class=\"tooltip-content__auth-button tooltip-content__auth-button-vkontakte\" ng-click=\"login_with(\'http://localhost:3000/users/auth/vkontakte\')\">\n          <div class=\"tooltip-content__auth-button-img\"><\/div>\n          <div class=\"tooltip-content__auth-button-label\">Войти через Вконтакте<\/div>\n        <\/div>\n        <div class=\"tooltip-content__auth-button tooltip-content__auth-button-twitter\" ng-click=\"login_with(\'http://localhost:3000/users/auth/twitter\')\">\n          <div class=\"tooltip-content__auth-button-img\"><\/div>\n          <div class=\"tooltip-content__auth-button-label\">Войти через Twitter<\/div>\n        <\/div>\n        <div class=\"tooltip-content__auth-button tooltip-content__auth-button-google_oauth2\" ng-click=\"login_with(\'http://localhost:3000/users/auth/google_oauth2\')\">\n          <div class=\"tooltip-content__auth-button-img\"><\/div>\n          <div class=\"tooltip-content__auth-button-label\">Войти через Google<\/div>\n        <\/div>\n      <\/div>\n    <\/div>\n    <div class=\"tooltip-content__achievements\">\n      <ul>\n        <li class=\"tooltip-content__achievements-{{achievement.id}}\" ng-repeat=\"achievement in achievements\" ng-class=\"{\'tooltip-content__achievements-incomplete\': !achievement.is_reached()}\">\n          <div class=\"tooltip-content__achievements-count\" ng-show=\"achievement.is_repeatable()\">{{achievement.count}}<\/div>\n          <div class=\"tooltip-content__achievements-point\">{{achievement.display_points()}}<\/div>\n          <div class=\"tooltip-content__achievements-text\">{{achievement.title}}<\/div>\n        <\/li>\n      <\/ul>\n    <\/div>\n    <div class=\"tooltip-content__explanation\">Что такое авиасила? Нет времени объяснять, но будет круто!<\/div>\n  <\/div>\n<\/div>');
  }]);


beforeEach(function(){
  jasmine.getFixtures().fixturesPath = '/base/spec/javascripts/fixtures';
});
