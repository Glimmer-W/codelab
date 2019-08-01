/**
 * Created by yineng on 2018/7/28 09:59
 *
 */
angular.module('yn.ui.buttons', []);
angular.module('yn.ui.selects', []);
angular.module('yn.ui', ['yn.ui.buttons', 'yn.ui.selects']);

angular.module('yn.web.component.tpls', []);

angular.module('yn.web.component', ['yn.web.component.tpls', 'yn.ui']);

angular.module('yn.ui.uploader', []);


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
              option.isShow = option[optionText].indexOf(vm.searchText) != -1;
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

/**
 * 图片上传指令
 * 适用范围：仅支持从相册选择图片或拍照后的图片上传功能，不支持其他非图片格式的文件上传！
 * Created by wangl on 2019/7/30 18:42
 *
 */
(function () {
  angular
    .module('starter')
    .constant('photoUploaderConfig', {
      // 最大照片上传数量，默认999
      maxPhotoNumber: 999
    })
    .directive("photoUploader", ["$cordovaFileTransfer", "$ionicPopup", "$ionicModal", "ynuiNotification", "$filter", "$timeout", "stringsConstant", "photoUploaderConfig", function ($cordovaFileTransfer, $ionicPopup, $ionicModal, ynuiNotification, $filter, $timeout, stringsConstant, photoUploaderConfig) {

      function Photo(uri, fsId) {
        this.uri = uri;
        this.path = uri.substr(0, uri.lastIndexOf('/') + 1);
        this.name = uri.substr(uri.lastIndexOf('/') + 1);
        this.fsId = fsId;
        this.uploadInfo = null;
      }

      /**
       * 上传信息
       * @constructor
       */
      function UploadInfo() {
        // 上传状态：-1 上传失败，0 初始状态（默认状态），1 上传成功
        this.status = 0;
        // 是否显示进度条
        this.showProgressBar = true;
        // 进度
        this.progress = 0;
        /**
         * 上传失败
         * @returns {boolean}
         */
        this.uploadFailure = function () {
          return this.status === -1;
        }
      }

      return {
        restrict: 'EA',
        scope: {
          /**
           * 非必须配置 | 相机配置，适用于需要加地址、时间、名称或水印的场景
           * 1.给照片加名称地址、时间的配置对象格式如下：
           * {name: "xxxx", address: "xxxxx", time: new Date()}
           * 2.给照片加文字水印的配置对象格式如下：
           * {waterMark: "xxxxxxx"}
           */
          cameraOption: "=",
          // 照片上传器发生改变时会回调此方法，可以通过此方法获取上传成功的照片对象信息
          onUploaderChange: "&"
        },
        require: "?ngModel",
        // 设置模板
        templateUrl: 'yn/templates/directives/uploader/photo.uploader.html',
        link: function (scope, element, attrs, ctrl) {
          if (!ctrl) {
            return; // do nothing if no ng-model
          }
          ctrl.$render = function () {
            render();
          };

          var maxPhotoNumber = angular.isDefined(attrs.maxPhotoNumber) ? scope.$parent.$eval(attrs.maxPhotoNumber) : photoUploaderConfig.maxPhotoNumber;
          var vm = scope.vm = {
            // 已选的照片
            photos: [],
            //
            modal: null,
            /**
             * 选取照片
             */
            selectPhoto: function () {
              if (this.photos.length >= maxPhotoNumber) {
                ynuiNotification.error({msg: '只能上传' + maxPhotoNumber + '张照片！'});
                return;
              }
              this.modal.show();
            },
            /**
             * 从相册选择照片
             */
            selectPhotosFromAlbums: function () {
              this.modal.hide();
              var that = this;
              navigator.camera.getPicture(
                function (data) {
                  console.log(JSON.stringify(data));
                  var photo = {
                    uri: data,
                    path: data.substr(0, data.lastIndexOf('/') + 1),
                    name: data.substr(data.lastIndexOf('/') + 1),
                    fsId: '',
                    status: 0,
                    progress: 0
                  };
                  that.photos.push(new Photo(data, null));
                  upload(photo);
                },
                function (error) {
                  console.log(JSON.stringify(error))
                },
                {sourceType: Camera.PictureSourceType.PHOTOLIBRARY}
              );
            },
            /**
             * 直接拍照
             */
            takePicture: function () {
              // 隐藏模态框
              this.modal.hide();
              var that = this;
              var customCamera = yn.plugin.customcamera;
              // 如果有相机配置，则设置
              var opts = scope.cameraOption ? [scope.cameraOption] : [];
              customCamera.startCamera(
                opts,
                function (data) {
                  var photo = new Photo(data, null);
                  that.photos.push(photo);
                  upload(photo);
                },
                function (data) {
                  console.error('拍照失败');
                  console.error(JSON.stringify(data));
                }
              );
            },
            /**
             * 删除照片
             * @param photo
             * @param index
             */
            deletePhoto: function (fsId, index) {
              $ionicPopup.confirm({
                title: '删除确认',
                template: '确认要删除当前照片吗?',
                cancelText: '取消',
                okText: '删除'
              }).then(function (flag) {
                if (flag) {
                  // 如果有fsId则说明照片已被上传至服务器，需要删除服务器上的文件
                  if (fsId) {
                    // 删除服务端文件
                    removePhotoInServer(fsId, index);
                  } else {
                    // 移除本地文件
                    removeLocalPhoto(index);
                  }
                }
              });
            },
            /**
             * 重试照片
             * @param photo
             */
            retry: function (photo) {
              console.log('上传失败照片重试: ' + photo.uri);
              if (photo.uploadInfo.uploadFailure()) {
                upload(photo)
              }
            },
            /**
             * 预览照片
             * @param photo
             */
            previewPhoto: function (photo) {
              var cordovaFileOpen = cordova.plugins.disusered.open;
              cordovaFileOpen(
                photo.uri,
                // 预览成功回调事件
                function () {
                },
                /**
                 * 预览出错回调事件
                 * @param code
                 */
                function (code) {
                  var template = code === 1 ? '未能在手机已安装APP中找到可预览此文件的程序' : '预览时发生了未知错误 #' + code;
                  $ionicPopup.alert({
                    title: '文件预览提示',
                    template: template
                  });
                }
              );
            }
          };

          init();

          ctrl.$render = function () {
            render();
          };

          function init() {
            $ionicModal.fromTemplateUrl('choosePhoto.html', {
              scope: scope,
              animation: 'slide-in-up'
            }).then(function (modal) {
              vm.modal = modal;
            });
          }

          function upload(photo) {
            photo.uploadInfo = new UploadInfo();
            // 参数
            var mac = stringsConstant.utils.uuid();
            var userId = JSON.parse(window.localStorage.getItem('authorizationStr')).userId;
            var options = new FileUploadOptions();
            options.fileName = photo.name;
            options.params = {
              name: photo.name,
              userId: userId,
              mac: mac
            };
            options.headers = {
              authorization: JSON.parse(window.localStorage.getItem("authorizationStr")).access_token
            };
            $cordovaFileTransfer
              .upload(stringsConstant.file.uploadServer(), photo.uri, options)
              .then(
                function (uploadSuccessData) {
                  console.log(JSON.stringify(uploadSuccessData.response));
                  // 上传完成
                  photo.fsId = JSON.parse(uploadSuccessData.response).result.fileId;
                  if (photo.fsId) {
                    photo.uploadInfo.status = 1;
                    photo.uploadInfo.showProgressBar = false;
                    setModelVal();
                  } else {
                    console.error('上传失败,fsId为空');
                    photo.uploadInfo.status = -1;
                  }
                },
                function (uploadError) {
                  console.error('上传失败');
                  console.error(JSON.stringify(uploadError));
                  photo.status = '-1';
                  photo.uploadInfo.status = -1;
                },
                function (progress) {
                  $timeout(function () {
                    photo.uploadInfo.progress = parseInt((progress.loaded / progress.total) * 100) + '%';
                    console.log('上传进度: ' + photo.progress);
                  });
                }
              );
          }

          /**
           * 移除服务器上已上传的照片
           * @param fsId
           * @param index
           */
          function removePhotoInServer(fsId, index) {
            $http({
              method: 'GET',
              url: stringsConstant.file.deleteServer() + fsId
            }).success(
              function (deletePhotoRes) {
                console.log(JSON.stringify(deletePhotoRes));
                if (deletePhotoRes.status === 0) {
                  // 已从文件服务器删除文件，执行本地删除
                  removeLocalPhoto(index);
                }
              }
            ).error(
              function (deletePhotoErr) {
                console.error('从文件服务器删除文件失败');
                console.error(JSON.stringify(deletePhotoErr));
              }
            );
          }

          function removeLocalPhoto(index) {
            vm.photos.splice(index, 1);
            setModelVal();
          }

          // view -> model
          function setModelVal() {
            var fsIdArr = [], photos = [];
            // 遍历照片，获取上传至服务器的照片对应的fsId
            angular.forEach(vm.photos, function (photo) {
              if (photo.fsId) {
                fsIdArr.push(photo.fsId);
                photos.push(photo);
              }
            });
            ctrl.$setViewValue(fsIdArr);
            onUploaderChange({photos: photos});
          }

          /**
           * 指令自定渲染，处理model数据改变时，view的展示情况
           */
          function render() {
            vm.photos = [];
            angular.forEach(ctrl.$viewValue, function (fsId) {
              vm.photos.push(new Photo(stringsConstant.file.downloadServer() + fsId, fsId));
            })
          }

        }
      };
    }]);
})();

/**
 * 验证提示信息
 * Created by wangl on 2018/8/6 11:27
 */
angular.module('yn.ui')
  .service('validateHintService', function () {
    return {
      generate: function (element) {
        var tipwrap, tiptpl, tipdom;
        var hint = {
          generator: function () {
            tipdom = element;
            tipwrap = angular.element('<div class="gtooltip-wrap"></div>');
            tipwrap.css({
              'height': tipdom.outerHeight() == 0 ? 'inherit' : tipdom.outerHeight(),
              'display': tipdom.css('display')
            });

            tiptpl = angular.element(
              '<div class="gtooltip">' +
              '<div class="tooltip-arrow"></div>' +
              '<div class="tooltip-inner"></div>' +
              '</div>');

            tiptpl.addClass('top');
            if (!tipdom.parent().hasClass('gtooltip-wrap')) {
              tipdom.wrap(tipwrap);
              tiptpl.insertAfter(tipdom);
            }
            tiptpl.appendTo(angular.element('body'));
            if (!tipdom.parents('.gtooltip-wrap').find('.gtooltip').length) {
              tiptpl.insertAfter(tipdom);
            }
          },
          show: function (tips) {
            tipdom.addClass('focus-true');
            tiptpl = tipdom.parent().find('.gtooltip');
            tiptpl.find('.tooltip-inner').html(tips);
            tiptpl.css({'position': 'fixed'});
            tiptpl.appendTo('body');
            if (tiptpl.find('.tooltip-inner').css('width')) {
              tiptpl.css({'display': 'block', 'left': '-500px'});
              tiptpl.find('.tooltip-inner').css({'width': 'auto'});
            }
            tiptpl.find('.tooltip-inner').css({'width': tiptpl.outerWidth() + 1});
            if (!tipdom.parents('.gtooltip-wrap').find('.gtooltip').length) {
              tiptpl.insertAfter(tipdom);
            }
            tiptpl.css({'position': 'absolute'});
            var bottom, left;
            bottom = (tipdom.outerHeight() - 3);
            left = 0;
            tiptpl.css({'bottom': bottom, 'left': left});
            tipdom.focus().val(tipdom.val());
            tipdom.parent().addClass('has-error');
          },
          remove: function () {
            tipdom.parent().removeClass('has-error');
            tiptpl.css('display', 'none');
          }
        };
        hint.generator();
        return hint;
      }
    };
  });

angular.module('yn.web.component.tpls').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('yn/templates/directives/buttons/morecondition/morecondition.html',
    "<button type=\"button\" class=\"btn btn-link\" ng-click=\"isMore = !isMore\">\n" +
    "  {{isMore ? \"收起\" : \"更多\"}}<i ng-class=\"{'fa fa-angle-up': isMore, 'fa fa-angle-down': !isMore}\"></i>\n" +
    "</button>\n"
  );


  $templateCache.put('yn/templates/directives/select/select.html',
    "<div class=\"btn-group select-group btn-ib\">\n" +
    "  <button class=\"btn btn-default btn-ib dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\"\n" +
    "          title=\"{{vm.title ? vm.title : vm.placeholder}}\">\n" +
    "    {{vm.title ? vm.title : vm.placeholder}}<i class=\"fa fa-angle-down\"></i>\n" +
    "  </button>\n" +
    "  <div class=\"dropdown-menu dropdown-content hold-on-click\">\n" +
    "      <!--搜索开始-->\n" +
    "      <div class=\"input-icon input-group-sm input-inline\" ng-if=\"vm.useSearch\">\n" +
    "        <i class=\"fa fa-search\"></i>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"搜索...\" ng-model=\"vm.searchText\"\n" +
    "               ng-change=\"vm.searchOption()\">\n" +
    "      </div>\n" +
    "      <!--搜索结束-->\n" +
    "\n" +
    "      <div class=\"select-items dropdown-checkboxes no-space\">\n" +
    "        <label ng-if=\"vm.options.length == 0\">没有相关数据！</label>\n" +
    "        <label ng-repeat=\"option in vm.options\" ng-if=\"option.isShow\">\n" +
    "          <input type=\"checkbox\" ng-model=\"option.isChecked\"  ng-change=\"vm.selectOption(evt)\"/>{{vm.getOptionText(option)}}\n" +
    "        </label>\n" +
    "      </div>\n" +
    "\n" +
    "      <!--全选开始-->\n" +
    "      <div class=\"select-group-bottom\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"vm.isCheckedAll\" ng-change=\"vm.selectAllOption()\"/>全选</label>\n" +
    "      </div>\n" +
    "      <!--全选结束-->\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('yn/templates/directives/select/single-select/single-select.html',
    "<div class=\"btn-group select-group btn-ib\">\n" +
    "  <button class=\"btn btn-default btn-ib dropdown-toggle form-control\" type=\"button\" data-toggle=\"dropdown\"\n" +
    "          title=\"{{vm.title ? vm.title : vm.placeholder}}\">\n" +
    "    {{vm.title ? vm.title : vm.placeholder}}<i class=\"fa fa-angle-down\"></i>\n" +
    "  </button>\n" +
    "  <div class=\"dropdown-menu dropdown-content\">\n" +
    "      <!--搜索开始-->\n" +
    "      <div class=\"input-icon input-group-sm input-inline\" ng-if=\"vm.useSearch\">\n" +
    "        <i class=\"fa fa-search\"></i>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"搜索...\" ng-model=\"vm.searchText\"\n" +
    "               ng-change=\"vm.searchOption()\">\n" +
    "      </div>\n" +
    "      <!--搜索结束-->\n" +
    "\n" +
    "      <div class=\"select-items dropdown-checkboxes no-space\">\n" +
    "        <label ng-if=\"vm.options.length == 0\">没有相关数据！</label>\n" +
    "        <label ng-repeat=\"option in vm.options\" ng-class=\"{active: vm.isSelected(option)}\" ng-if=\"option.isShow\" ng-click=\"vm.selectOption(option, evt)\">\n" +
    "          {{vm.getOptionText(option)}}\n" +
    "        </label>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('yn/templates/directives/uploader/photo.uploader.html',
    "<div class=\"image-upload-wrap clearfix\">\n" +
    "  <ul class=\"image-list\">\n" +
    "    <li ng-repeat=\"photo in vm.photos\">\n" +
    "      <div class=\"image\">\n" +
    "        <img ng-src=\"{{photo.uri}}\" ng-click=\"vm.previewPhoto(photo)\">\n" +
    "        <div ng-if=\"photo.uploadInfo.showProgressBar\" class=\"progress\"\n" +
    "             ng-class=\"{'error': photo.uploadInfo.uploadFailure()}\">\n" +
    "          <div class=\"progress-bar\" ng-style=\"{'width': photo.uploadInfo.progress}\">\n" +
    "            <span ng-click=\"vm.retry(photo)\" ng-if=\"photo.uploadInfo.uploadFailure()\">重试</span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <span class=\"delete\" ng-click=\"vm.deletePhoto(photo.fsId, $index)\">-</span>\n" +
    "    </li>\n" +
    "    <li class=\"picker-wrap\">\n" +
    "      <div class=\"imagePicker\" ng-click=\"vm.selectPhoto()\">+</div>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "<script id=\"choosePhoto.html\" type=\"text/ng-template\">\n" +
    "  <div class=\"modal modal-btm modal-height\">\n" +
    "    <div class=\"modal-list-wrap\">\n" +
    "      <div class=\"list-heading clearfix\">\n" +
    "        请选择<span class=\"calm\" ng-click=\"vm.modal.hide()\">取消</span>\n" +
    "      </div>\n" +
    "      <ul class=\"list-wrap text-center\">\n" +
    "        <li class=\"list-item\" ng-click=\"vm.selectPhotosFromAlbums()\">从相册选择照片</li>\n" +
    "        <li class=\"list-item\" ng-click=\"vm.takePicture()\">直接拍照</li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</script>\n"
  );

}]);
