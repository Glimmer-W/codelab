'use strict';

/**
 * @ngdoc function
 * @name codelabApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the codelabApp
 */
angular.module('codelabApp')
  .controller('ComponentCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.tabs = [
      {title: '标签页a', content: '标签页a的内容'},
      {title: '标签页b', content: '标签页b的内容', disabled: true}
    ];

    $scope.alertMe = function () {
      setTimeout(function () {
        $window.alert('clicked!');
      });
    };
  });
