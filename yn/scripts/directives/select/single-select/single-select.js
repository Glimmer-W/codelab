/**
 * 下拉单选+搜索
 * Created by wangl on 2018/8/2 11:26
 *
 */
angular.module('yn.ui.selects')
  .constant('ynUiSingSelectConfig', {
    // 数据项值
    optionValue: "id",
    // 数据项显示文本
    optionText: "name",
    // 组件默认显示的文本
    placeholder: "全部",
    // 是否使用搜索功能，默认为“不使用”
    useSearch: false,
    // 必选提示，默认为“不能为空！”，结合[required]属性组合使用（只有配置了required属性，才会显示必选提示）
    requiredHint: "不能为空！"
  })
  .directive('ynUiSingSelect', function (ynUiSingSelectConfig, validateHintService) {
    return {
      restrict: "EA",
      scope: {
        options: "=",
        // 选择数据时触发此方法，该方法会返回选中的数据项对象本身，方便获取其他属性
        onSelected: "&"
      },
      templateUrl: 'yn/templates/directives/select/single-select/single-select.html',
      require: "?ngModel",
      link: function (scope, element, attrs, ctrl) {
        if (!ctrl) {
          return; // do nothing if no ng-model
        }
        var vm = scope.vm = {},
          onSelected = angular.isFunction(scope.onSelected) ? scope.onSelected : angular.noop,
          optionValue = angular.isDefined(attrs.optionValue) ? scope.$parent.$eval(attrs.optionValue) : ynUiSingSelectConfig.optionValue,
          optionText = angular.isDefined(attrs.optionText) ? scope.$parent.$eval(attrs.optionText) : ynUiSingSelectConfig.optionText,
          requiredHint = angular.isDefined(attrs.requiredHint) ? scope.$parent.$eval(attrs.requiredHint) : ynUiSingSelectConfig.requiredHint,
          // 是否启用必填
          required = angular.isDefined(attrs.required);

        // 选中数据项的标题
        vm.title = "";
        vm.placeholder = angular.isDefined(attrs.placeholder) ? scope.$parent.$eval(attrs.placeholder) : ynUiSingSelectConfig.placeholder;
        vm.useSearch = angular.isDefined(attrs.useSearch) ? scope.$parent.$eval(attrs.useSearch) : ynUiSingSelectConfig.useSearch;

        vm.getOptionText = function (option) {
          return option[optionText];
        };

        ctrl.$render = function () {
          render();
        };

        vm.options = [];
        vm.searchText = "";
        vm.selectedOption = null;

        /**
         * 监听数据项
         */
        scope.$watchCollection('options', function (options) {
          vm.options = [];
          // 防止污染数据，复制一份数据项
          angular.forEach(options, function (option) {
            var _option = angular.copy(option);
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
        vm.selectOption = function (option, evt) {
          if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          vm.selectedOption = option;
          buildSelectedOptionTitle();
          setModelVal();
        };


        vm.searchOption = function () {
          angular.forEach(vm.options, function (option) {
            if (vm.searchText) {
              option.isShow = option[ynUiSingSelectConfig.optionText].indexOf(vm.searchText) != -1;
            } else {
              option.isShow = true;
            }
          });
        };

        /**
         * 是否已被选中
         * @param option
         * @returns {boolean}
         */
        vm.isSelected = function (option) {
          return vm.selectedOption == option;
        };

        // 启用“必填”验证
        if (required) {
          var formName = element.closest("form")['0'].name;
          var formController = scope.$parent[formName];
          var hint = validateHintService.generate(element);
          // 如果ngModel本身变“脏”，或者表单被点击提交了，且此时ngModel无效时才显示错误提示
          scope.$watch(function () {
            // 只处理“必填”验证
            if (angular.isDefined(ctrl.$error.required)) {
              return (ctrl.$dirty || formController.$submitted) && ctrl.$invalid;
            }
            return false;
          }, function (hasError) {
            hasError ? hint.show(requiredHint) : hint.remove();
          });
        }


        /**
         * 构建选中数据项显示的标题
         */
        function buildSelectedOptionTitle() {
          vm.title = "";
          if (vm.selectedOption) {
            vm.title = vm.selectedOption[optionText];
          }
        }

        // view->model
        function setModelVal() {
          var modelVal = null;
          angular.forEach(vm.options, function (option) {
            if (option[optionValue] == vm.selectedOption[optionValue]) {
              modelVal = option.originalOption;
            }
          });
          ctrl.$setViewValue(vm.selectedOption[optionValue]);
          onSelected({option: modelVal});
        }

        /**
         * 指令自定渲染，处理model数据改变时，选中数据项
         */
        function render() {
          vm.selectedOption = null;
          angular.forEach(vm.options, function (option) {
            if (ctrl.$viewValue == option[optionValue]) {
              vm.selectedOption = option;
            }
          });
          buildSelectedOptionTitle();
        }
      }
    };
  });
