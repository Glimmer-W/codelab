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
    $scope.content = "<yn-ui-btn-more-con></yn-ui-btn-more-con>";
    // 是否显示更多条件
    $scope.isShowMoreCon = false;
  });

function ComponentCtrl($scope) {
  // 是否显示更多条件
  $scope.isShowMoreCon = false;
}
function ynUiBtnMoreConDirective() {
  return {
    restrict: "AE",
    scope: {
      isMore: "=?" //是否展示更多条件
    },
    // 设置模板
    template: function () {
      return '<button type="button" class="btn btn-link" ng-click="isMore = !isMore">' +
        '{{isMore ? "收起" : "更多"}}' +
        '<i ng-class="{\'fa fa-angle-up\': isMore, \'fa fa-angle-down\': !isMore}"></i>' +
        '</button>'
    },
    link: function ($scope, iElement, iAttrs) {

    }
  };
}
