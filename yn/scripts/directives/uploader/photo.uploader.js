/**
 * 图片上传指令
 * 适用范围：仅支持从相册选择图片或拍照后的图片上传功能，不支持其他非图片格式的文件上传！
 * Created by wangl on 2019/7/30 18:42
 *
 */
angular
  .module('starter')
  .constant('photoUploaderConfig', {
    // 最大照片上传数量，默认999
    maxPhotoNumber: 999
  })
  .directive("photoUploader", ["$cordovaFileTransfer", "$ionicPopup", "$ionicModal", "$http", "ynuiNotification", "$filter", "$timeout", "stringsConstant", "photoUploaderConfig", function ($cordovaFileTransfer, $ionicPopup, $ionicModal, $http, ynuiNotification, $filter, $timeout, stringsConstant, photoUploaderConfig) {

    function Photo(uri, fsId, uploadInfo) {
      this.uri = uri;
      this.path = uri.substr(0, uri.lastIndexOf('/') + 1);
      this.name = uri.substr(uri.lastIndexOf('/') + 1);
      this.fsId = fsId;
      this.uploadInfo = uploadInfo;
    }

    /**
     * 上传信息
     * @constructor
     */
    function UploadInfo(status, progress) {
      // 上传状态：-1 上传失败，0 初始状态，1 上传成功
      this.status = status;
      // 是否显示进度条
      this.showProgressBar = true;
      // 进度
      this.progress = progress;
      /**
       * 上传失败
       * @returns {boolean}
       */
      this.uploadFailure = function () {
        return this.status === -1;
      };

      this.uploadSuccess = function () {
        return this.status === 1;
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
      templateUrl: 'templates/directives/uploader/photo.uploader.html',
      link: function (scope, element, attrs, ctrl) {
        if (!ctrl) {
          return; // do nothing if no ng-model
        }

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
                that.photos.push(new Photo(data, null, new UploadInfo(0, 0)));
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
                var photo = new Photo(data, null, new UploadInfo(0, 0));
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
          if (angular.isDefined(scope.onUploaderChange)) {
            scope.onUploaderChange({photos: photos});
          }
        }

        /**
         * 指令自定渲染，处理model数据改变时，view的展示情况
         */
        function render() {
          vm.photos = [];
          angular.forEach(ctrl.$viewValue, function (fsId) {
            vm.photos.push(new Photo(stringsConstant.file.downloadServer() + fsId, fsId, new UploadInfo(1, "100%")));
          })
        }

      }
    };
  }]);
