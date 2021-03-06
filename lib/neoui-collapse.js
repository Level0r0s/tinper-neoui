/**
 * Module : neoui-collapse
 * Author :  yaoxinc(yaoxinc@yonyou.com)
 * Date   : 2016/11/30
 *
 */

import { addClass, removeClass, makeDOM } from 'tinper-sparrow/src/dom';
import { extend } from 'tinper-sparrow/src/extend';
import { on, off } from 'tinper-sparrow/src/event';

/* COLLAPSIBLE PLUGIN DEFINITION
 *
 */

function Collapse(element, options) {

    this.$element = $(element); //数值是下面的class等，且只执行一次
    this.options = $.extend({}, {
        toggle: true
    }, options); //数值是Oject{toggle:collapse}
    this.options.toggle && this.toggle(); //undefined
}

Collapse.prototype = {
    constructor: Collapse,
    dimension: function dimension() {
        /*  console.log(this.$element)*/
        var hasWidth = this.$element.hasClass('width'); //false
        return hasWidth ? 'width' : 'height'; //返回height
    },
    show: function show() {
        var dimension = this.dimension(),
            //数值是height
        scroll = $.camelCase(['scroll', dimension].join('-')),
            //数值scrollHeight
        actives = this.$parent && this.$parent.find('.in'),
            //数值undefined
        hasData;

        if (actives && actives.length) {
            hasData = actives.data('collapse');
            actives.collapse('hide');
            hasData || actives.data('collapse', null);
        }
        this.$element[dimension](0); //数值是下面的class等
        this.transition('addClass', 'show', 'shown');
        this.$element[dimension](this.$element[0][scroll]);
    },
    transition: function transition(method, startEvent, completeEvent) {
        //'addClass', 'show', 'shown'
        var that = this,
            complete = function complete() {
            if (startEvent == 'show') that.reset();
            that.$element.trigger(completeEvent);
        };
        this.$element.trigger(startEvent)[method]('in');

        $.support.transition && this.$element.hasClass('collapse') ? this.$element.one($.support.transition.end, complete) : complete();
    },
    reset: function reset(size) {
        var dimension = this.dimension(); //数值一直是height
        this.$element.removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth; //1200
        this.$element.addClass('collapse');
    },
    hide: function hide() {
        var dimension = this.dimension();
        this.reset(this.$element[dimension]());
        this.transition('removeClass', 'hide', 'hidden');
        this.$element[dimension](0);
    },

    toggle: function toggle() {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }

};

var showCollapse = u.BaseComponent.extend({

    /* COLLAPSIBLE DATA-API
     * ==================== */
    init: function init() {
        off(this.element, 'click');
        on(this.element, 'click', function (e) {
            var $this = $(this);

            var href;
            var target = (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') || $this.attr('u-data-toggle') || e.preventDefault(); //strip for ie7

            var option = $(target).data('collapse') ? 'toggle' : $this.data();
            var $this_down = $(target);

            var data = $this_down.data('collapse'),
                options = (typeof option === 'undefined' ? 'undefined' : babelHelpers['typeof'](option)) == 'object' && option;

            if (!data) {
                $this_down.data('collapse', data = new Collapse(target, options));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    }

});

if (u.compMgr) u.compMgr.regComp({
    comp: showCollapse,
    compAsString: 'u.collapse.updown',
    css: 'u-collapse-updown'
});

export { showCollapse };