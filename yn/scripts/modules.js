/**
 * Created by yineng on 2018/7/28 09:59
 *
 */
angular.module('yn.ui.buttons', []);
angular.module('yn.ui.selects', []);
angular.module('yn.ui', ['yn.ui.buttons', 'yn.ui.selects']);

angular.module('yn.web.component.tpls', []);

angular.module('yn.web.component', ['yn.web.component.tpls', 'yn.ui']);

