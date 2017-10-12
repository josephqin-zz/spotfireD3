(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.scrollerBar = factory(global.d3));
}(this, (function (d3) { 'use strict';

'use strict';

var width$1 = 200;
var height$1 = 25;
var placeholder = 'Select...';
//module events defination
var dispatcher = d3.dispatch('getInput', 'reset');

dispatcher.on('getInput', function (value) {
	console.log(this.value);
});
dispatcher.on('reset', function () {});

var inpoutBox = function inpoutBox(_selection) {
	var inputBox = _selection.append('g').attr('id', 'inputBox').append('foreignObject').attr("width", width$1).attr("height", height$1).append('xhtml:input').attr('placeholder', placeholder).on('keyup', function () {

		dispatcher.call('getInput', this, this.value);
	});
};

inpoutBox.setInputFn = function (fn) {
	dispatcher.on('getInput', fn);
	return this;
};

inpoutBox.setHeight = function (data) {
	if (!arguments.length) return height$1;
	height$1 = data;
	return this;
};

inpoutBox.setWidth = function (data) {
	if (!arguments.length) return dataset;
	width$1 = data;
	return this;
};

inpoutBox.setPlaceholder = function (data) {
	if (!arguments.length) return placeholder;
	placeholder = data;
	return this;
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

'use strict';

var options = d3.range('100').map(function (d, i) {
	return { value: 'opt' + i, selected: false, show: true };
});
var width = 200;
var height = 300;
var rowRanges = d3.range(10);
var selectFn = function selectFn(value) {
	console.log(value + ' is selected');
};

var scrollerBar = function scrollerBar(_selection) {
	var _this = this;

	_selection.selectAll('*').remove();
	var cellHeight = (height - 30) / rowRanges.length;
	var cellWidth = width;

	var dispatcher = d3.dispatch('updateOpts', 'selectOpt', 'autoComplete');
	var inputFn = function inputFn(value) {
		options = options.map(function (d) {
			return _extends({}, d, { show: value && d.value.toLowerCase().indexOf(value) === -1 ? false : true });
		});
		rowRanges = d3.range(rowRanges.length);
		dispatcher.call('updateOpts', _this, rowRanges);
	};
	var inputPanelFn = inpoutBox.setWidth(width).setInputFn(inputFn).setPlaceholder('Searching');
	var inputPanel = _selection.append('g').attr('id', 'inputBox').call(inputPanelFn);
	var selectionPanel = _selection.append('g').attr('id', 'selectionPanel').attr('transform', d3.zoomIdentity.translate(0, 30));

	dispatcher.on('selectOpt', function (opt) {
		options = options.map(function (d) {
			return _extends({}, d, { selected: d.value === opt.value ? true : false });
		});
		selectFn(opt.value);

		inputPanel.call(inputPanelFn.setPlaceholder(opt.value));
		selectionPanel.selectAll('*').remove();
	});

	dispatcher.on('updateOpts', function () {
		var _this2 = this;

		var ranges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [].concat(toConsumableArray(rowRanges));

		selectionPanel.selectAll('*').remove();
		var showOptions = options.filter(function (d) {
			return d.show;
		});
		selectionPanel.selectAll('g').data(showOptions.filter(function (d, i) {
			return ranges.includes(i);
		})).enter().append('g').each(function (opt, i) {

			var text = opt.value === null ? 'no value' : opt.value.toString();
			var textsize = Math.floor(cellWidth / text.length);

			d3.select(this).attr('transform', d3.zoomIdentity.translate(0, cellHeight * i));
			d3.select(this).append('rect').attr('width', cellWidth).attr('height', cellHeight).attr('fill', opt.selected ? '#f7d0b2' : '#ffffff');

			d3.select(this).append('text').text(text).style('fill', '#000000')
			//control text size to include everthing in cell
			.style('font-size', textsize * 2.2 > 16 ? 16 : textsize * 2.2).attr('x', 0).attr('y', cellHeight / 2).style('dominant-baseline', 'middle').style('text-anchor', 'start');
		}).on('click', function (d) {
			return dispatcher.call('selectOpt', _this2, d);
		});

		selectionPanel.on('mousewheel.zoom', function () {
			if (showOptions.length > rowRanges.length) {
				var step = d3.event.wheelDelta < 0 ? 1 : -1;
				if (!(step < 0 && d3.min(rowRanges) - 1 === -1) && !(step > 0 && d3.max(rowRanges) + 1 === showOptions.length)) rowRanges = rowRanges.map(function (d) {
					return d + step;
				});

				dispatcher.call('updateOpts', this, rowRanges);
			}
		});
	});

	dispatcher.call('updateOpts', this, rowRanges);
};

scrollerBar.bindData = function (data) {
	if (!arguments.length) return options;
	options = [].concat(toConsumableArray(data.map(function (d) {
		return { value: d, selected: false, show: true };
	})));
	return this;
};

scrollerBar.setHeight = function (data) {
	if (!arguments.length) return height;
	height = data;
	return this;
};

scrollerBar.setWidth = function (data) {
	if (!arguments.length) return dataset;
	width = data;
	return this;
};

scrollerBar.setRow = function (num) {
	if (!arguments.length) return rowRanges.length;
	rowRanges = d3.range(num);
	return this;
};

scrollerBar.setSelectFn = function (fn) {
	if (!arguments.length) return selectFn;
	selectFn = fn;
	return this;
};

return scrollerBar;

})));
