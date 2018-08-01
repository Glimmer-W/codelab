/**
 * Created by wangl on 2018/7/27 15:33
 *
 */
angular.module('yn.ui.buttons')
.directive('ynUiBtnMoreCon', function () {
    return {
        restrict: "AE",
        scope: {
            isMore: "=?" //是否展示更多条件
        },
        // 设置模板
        templateUrl: 'yn/templates/directives/buttons/morecondition/morecondition.html'
    };
});


