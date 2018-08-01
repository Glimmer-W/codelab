/**
 * Created by yineng on 2018/7/28 09:57
 *
 */
angular.module('yn.ui.selects')
  .constant('ynUiPcSelectConfig', {
    // 数据项值
    optionValue: "id",
    // 数据项显示文本
    optionText: "name",
    // 组件默认显示的文本
    placeholder: "全部",
    // 是否使用搜索功能，默认为“使用”
    useSearch: true
  })
  .directive('ynUiPcSelect', function (ynUiPcSelectConfig) {
    return {
      restrict: "EA",
      scope: {
        options: "=",
        // 选择数据时触发此方法，该方法会返回选中的数据项对象本身，方便获取其他属性
        onSelected: "&"
      },
      templateUrl: 'yn/templates/directives/select/select.html',
      require: "?ngModel",
      link: function (scope, element, attrs, ctrl) {
        if (!ctrl) {
          return; // do nothing if no ng-model
        }
        var vm = scope.vm = {},
          onSelected = angular.isFunction(scope.onSelected) ? scope.onSelected : angular.noop,
          optionValue = angular.isDefined(attrs.optionValue) ? scope.$parent.$eval(attrs.optionValue) : ynUiPcSelectConfig.optionValue,
          optionText = angular.isDefined(attrs.optionText) ? scope.$parent.$eval(attrs.optionText) : ynUiPcSelectConfig.optionText;

        // 选中数据项的标题
        vm.title = "";
        vm.placeholder = angular.isDefined(attrs.placeholder) ? scope.$parent.$eval(attrs.placeholder) : ynUiPcSelectConfig.placeholder;
        vm.useSearch = angular.isDefined(attrs.useSearch) ? scope.$parent.$eval(attrs.useSearch) : ynUiPcSelectConfig.useSearch;

        vm.getOptionText = function (option) {
          return option[optionText];
        };

        ctrl.$render = function () {
          render();
        };

        vm.options = [];
        vm.isCheckedAll = false;
        vm.searchText = "";
        /**
         * 监听数据项
         */
        scope.$watchCollection('options', function (options) {
          vm.options = [];
          // 防止污染数据，复制一份数据项
          angular.forEach(options, function (option) {
            var _option = angular.copy(option);
            _option.isChecked = false;
            _option.isShow = true;
            // 保存源数据项的引用，方便后面处理数据
            _option.originalOption = option;
            vm.options.push(_option);
          });
          render();
        });

        /**
         * 选中单个数据项
         */
        vm.selectOption = function (evt) {
          if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          judgeCheckedAll();
          buildSelectedOptionTitle();
          setModelVal();
        };

        /**
         * 选中或不选中全部数据项
         */
        vm.selectAllOption = function () {
          angular.forEach(vm.options, function (option) {
            if (option.isShow) {
              option.isChecked = vm.isCheckedAll;
            }
          });
          buildSelectedOptionTitle();
          setModelVal();
        };

        vm.searchOption = function () {
          angular.forEach(vm.options, function (option) {
            if (vm.searchText) {
              option.isShow = option[ynUiPcSelectConfig.optionText].indexOf(vm.searchText) != -1;
            } else {
              option.isShow = true;
            }
          });
          judgeCheckedAll();
        };


        /**
         * 判断是否选中了全部数据项
         */
        function judgeCheckedAll() {
          var checkedOptionNum = 0, optionNum = 0;
          angular.forEach(vm.options, function (option) {
            if (option.isShow) {
              optionNum++;
              if (option.isChecked) {
                checkedOptionNum++;
              }
            }
          });

          // 如果没有选项
          if (optionNum == 0) {
            vm.isCheckedAll = false;
          } else {
            vm.isCheckedAll = checkedOptionNum == optionNum;
          }
        }

        /**
         * 构建选中数据项显示的标题
         */
        function buildSelectedOptionTitle() {
          var arr = [];
          angular.forEach(vm.options, function (option) {
            if (option.isChecked) {
              arr.push(option[optionText]);
            }
          });

          if (vm.options.length != 0 && arr.length == vm.options.length) {
            vm.title = "全部";
          } else {
            vm.title = arr.join(",");
          }
        }

        // view->model
        function setModelVal() {
          var optionArr = [], optionValueArr = [];
          angular.forEach(vm.options, function (option) {
            if (option.isChecked) {
              optionArr.push(option.originalOption);
              optionValueArr.push(option[optionValue]);
            }
          });
          ctrl.$setViewValue(optionValueArr);
          onSelected({options: optionArr});
        }

        /**
         * 指令自定渲染，处理model数据改变时，选中数据项
         */
        function render() {
          angular.forEach(vm.options, function (option) {
            option.isChecked = ctrl.$viewValue.indexOf(option[optionValue]) != -1;
          });
          judgeCheckedAll();
          buildSelectedOptionTitle();
        }
      }
    };
  });
