/**
 * Created by yineng on 2018/8/1 11:08
 *
 */
angular.module('codelabApp').directive('hLight', function () {
  return {
    restrict: 'C',
    compile: function (tElem, tAttrs) {
      var markdownString = tElem.html();
      tElem.replaceWith(hljs.highlightAuto(markdownString).value);
      return function (scope, ele, attrs) {
      };
    }
  };
});
