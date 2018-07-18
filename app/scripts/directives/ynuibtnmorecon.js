(function (app) {
  'use strict';
  /**
   * @ngdoc directive
   * @name app.directive:ynuiBtnMoreCon
   * @description
   * # ynuiBtnMoreCon
   */
  app.directive('ynUiBtnMoreCon', function () {
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
  })
    .directive('toggle', [function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attr) {
          var toggleVal = attr.toggle;
          switch (toggleVal) {
            case 'tab':
              elem.click(function (e) {
                e.preventDefault();
              });
              break;
          }
        }
      }
    }])
    .directive('hLight', function () {
      return {
        restrict: 'C',
        link: function (scope, elem, attr) {
          var markdownString = elem.html();
          elem.replaceWith(hljs.highlightAuto(markdownString).value);
        }
      }
    })
})(angular.module('codelabApp'));
