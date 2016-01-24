'use strict';
(function() {
  angular.module('speechRecognition', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeController'
      });
  }]);
})();
