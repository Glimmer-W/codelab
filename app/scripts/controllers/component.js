'use strict';

/**
 * @ngdoc function
 * @name codelabApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the codelabApp
 */
angular.module('codelabApp')
  .controller('ComponentCtrl', function ($scope, $timeout) {
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
    $scope.content = "<yn-ui-btn-more-con></yn-ui-btn-more-con>";
    // 是否显示更多条件
    $scope.isShowMoreCon = false;

    $scope.options = [];
    var arr =[
      {id: 1, name: "张三"},
      {id: 2, name: "李四"},
      {id: 3, name: "王五"}
    ];

    $timeout(function () {
      $scope.options = arr;
    }, 2000);

    $scope.selectedOptions = [1,2,3];

    $scope.onSelectedOption = function (options) {
      console.log("调用父容器的方法", options);
    }

  });


