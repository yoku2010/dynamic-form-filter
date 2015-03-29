'use strict';
/**
 * @description: To add elements dynamically.
 * @dependency: jquery1.11.x, bootstrap
 * @verion: 0.1
 * @date: 29-Mar-2014
 */
 
(function($) {
	$.fn.extend({
		filterForm: function(options) {
			var options = $.extend({
				btnName: 'Add Filter',
				helpBox: true,
				helpMsg: 'Click on "Add Filter" to add elements in row.',
				noElemMsg: 'No element details.',
				enableRowLevelAddition: true,
				rowElems: [],
				rowLimit: Infinity
			},options);
			this.each(function() {
				new $.filterAddForm(this, options);
			});
			return this;
		}
	});
	$.filterAddForm = function (me, opt) {
		var ff = {
			obj: {
				$me: $(me),
				$addBtn: null
			},
			vr: {
				rowNum: 1,
				totalRow: 0
			},
			cl: {
				head: 'form-head',
				btn: 'btn btn-default',
				closeBtn: 'close',
				rowDiv: 'form-row',
				rowSDiv: 'form-s-row',
				msg: 'form-msg',
				noElemMsg: 'form-no-elem',
				gl: 'glyphicon',
				add: 'glyphicon-plus-sign',
				remove: 'glyphicon-minus-sign',
				close: 'glyphicon glyphicon-remove-circle',
				tag: 'form-control',
				disable: 'disabled'
			},
			elem: {
				'input': '<input/>',
				'button': '<button></button>',
				'textarea': '<textarea></textarea>',
				'select': '<select></select>'
			},
			func: {
				init: function() {
					ff.func.createButton().appendTo(ff.obj.$me);
					if (opt.helpBox) {
						ff.func.createHelpMsg().appendTo(ff.obj.$me);
					}
					opt.rowLimit || ff.func.enableDisableAddBtn(false);
				},
				createButton: function () {
					var $div = $('<div></div>').addClass(ff.cl.head);
					ff.obj.$addBtn = $('<button></button>').addClass(ff.cl.btn).text(opt.btnName).click(function(e) {
						ff.evnt.addFilter(this,e);
					}).appendTo($div);
					return $div;
				},
				createHelpMsg: function () {
					var $div = $('<div></div>').addClass(ff.cl.msg);
					$('<p></p>').text(opt.helpMsg).appendTo($div);
					return $div;
				},
				enableDisableAddBtn: function (isEnable) {
					if (isEnable) {
						ff.obj.$addBtn.prop('disabled', false).removeClass(ff.cl.disable);
					}
					else {
						ff.obj.$addBtn.prop('disabled', true).addClass(ff.cl.disable);
					}
				},
				createElem: function (elemProp, rowNum) {
					var $elem, $input;
					rowNum = rowNum || '';

					if ('input' === elemProp.tag) {
						if ('checkbox' === elemProp.type || 'radio' === elemProp.type) {
							$elem = $('<label></label>').addClass(ff.cl.tag).text(elemProp.placeholder);
							$input = $(ff.elem[elemProp.tag]);
							elemProp.type && $input.attr('type', elemProp.type);
							elemProp.name && $input.attr('name', elemProp.name + '_' + rowNum);
							elemProp.cl && $input.addClass(elemProp.cl);
							$input.appendTo($elem);
						}
						else {
							$elem = $(ff.elem[elemProp.tag]).addClass(ff.cl.tag);
						}
						elemProp.type && $elem.attr('type', elemProp.type);
						elemProp.name && $elem.attr('name', elemProp.name + '_' + rowNum);
						elemProp.cl && $elem.addClass(elemProp.cl);
						elemProp.placeholder && $elem.attr('placeholder', elemProp.placeholder);
					}
					else if ('select' === elemProp.tag) {
						$elem = $(ff.elem[elemProp.tag]).addClass(ff.cl.tag);
						if (elemProp.opts) {
							for (var i = 0, ln = elemProp.opts.length; i <ln; i++) {
								$('<option></option>').text(elemProp.opts[i].text).val(elemProp.opts[i].value).appendTo($elem);
							}
						}
						elemProp.name && $elem.attr('name', elemProp.name + '_' + rowNum);
						elemProp.cl && $elem.addClass(elemProp.cl);
					}
					else {
						$elem = $(ff.elem[elemProp.tag]).addClass(ff.cl.tag);
						elemProp.name && $elem.attr('name', elemProp.name + '_' + rowNum);
						elemProp.cl && $elem.addClass(elemProp.cl);
						elemProp.placeholder && $elem.attr('placeholder', elemProp.placeholder);
					}
					return $elem;
				},
				createElementRow: function (elems, rowNum) {
					var $sDiv = $('<div></div>').addClass(ff.cl.rowSDiv).hide(), $addRemoveBtn = $('<a></a>').attr('href', '#').click(function (e) {
						ff.evnt.addRemoveElementRow(this, e);
					}), i = 0, ln = elems.length;

					if (0 === ln) {
						$('<p></p>').addClass(ff.cl.noElemMsg).text(opt.noElemMsg).appendTo($sDiv);
					}
					else {
						$('<span></span>').addClass(ff.cl.gl).addClass(ff.cl.add).appendTo($addRemoveBtn);
						for (; i < ln; i++) {
							ff.func.createElem(elems[i], rowNum).appendTo($sDiv);
						}
						opt.enableRowLevelAddition && $addRemoveBtn.appendTo($sDiv);
					}
					return $sDiv;
				},
				createRow: function (elems) {
					var $div = $('<div></div>').addClass(ff.cl.rowDiv).hide(), $close = $('<a></a>').addClass(ff.cl.closeBtn).attr('href', '#').click(function (e) {
						ff.evnt.removeRow(this, e);
					});
					$('<span></span>').addClass(ff.cl.close).appendTo($close);
					$close.appendTo($div);
					$('<input/>').attr({'type':'hidden', 'name': 'row_num'}).val(ff.vr.rowNum).appendTo($div.data('row_num', ff.vr.rowNum));
					ff.func.createElementRow(elems, ff.vr.rowNum).appendTo($div).show();
					ff.vr.rowNum++;
					++ff.vr.totalRow == opt.rowLimit && ff.func.enableDisableAddBtn(false);
					return $div;
				}
			},
			evnt: {
				addFilter: function (me, event) {
					event.preventDefault();
					ff.func.createRow(opt.rowElems).appendTo(ff.obj.$me).slideDown(500);
				},
				removeRow: function (me, event) {
					event.preventDefault();
					$(me).parent().slideUp(500, function () {
						$(this).remove();
						--ff.vr.totalRow < opt.rowLimit && ff.func.enableDisableAddBtn(true);
					});
				},
				addRemoveElementRow: function (me, event) {
					event.preventDefault();
					var $me = $(me), $span = $me.children('span');
					if ($span.hasClass(ff.cl.remove)) {
						ff.evnt.removeElementRow($me);
					}
					else if ($span.hasClass(ff.cl.add)) {
						$span.removeClass(ff.cl.add).addClass(ff.cl.remove);
						ff.evnt.addElementRow($me);
					} 
				},
				removeElementRow: function ($me) {
					$me.parent().slideUp(500, function () {
						$(this).remove();
					});
				},
				addElementRow: function ($me) {
					var $div = $me.parents('.' + ff.cl.rowDiv);
					ff.func.createElementRow(opt.rowElems, $div.data('row_num')).appendTo($div).slideDown(500);
				}
			}
		};
		// call init function
		ff.func.init();
	}
})(jQuery);