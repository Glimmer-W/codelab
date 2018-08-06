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
