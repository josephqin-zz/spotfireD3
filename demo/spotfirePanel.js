(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.spotfirePanel = factory(global.d3));
}(this, (function (d3) { 'use strict';

'use strict';

var height$2 = 1000;
var dataSet$1 = [{ name: 'bar', type: 'bar', color: '#F9D5D3', selected: false }, { name: 'stack', type: 'stackbar', color: '#ECA4A6', selected: false }, { name: 'pie', type: 'grouppie', color: '#807F89', selected: false }, { name: 'line', type: 'stackline', color: '#99A89E', selected: false }, { name: 'std', type: 'std', color: '#BBC7BA', selected: false }];
var clickEventFn = function clickEventFn(d) {
  console.log('click');
};

var controlBar = function controlBar(_selection) {
  _selection.selectAll('*').remove();
  //render button
  var tabHeight = height$2 * 0.7 / dataSet$1.length;
  _selection.selectAll('g').data(dataSet$1).enter().append('g').attr('transform', function (t, i) {
    return d3.zoomIdentity.translate(9, 45 + (tabHeight + 2) * i);
  }).each(function (d, i) {
    var text = d.name === null ? 'no value' : d.name.toString();
    var textsize = Math.floor(tabHeight / text.length);
    d3.select(this).append('rect').attr('fill', d.color).attr('stroke', d.selected ? '#000000' : '#ffffff').attr('stroke-width', '1px').attr('width', 20).attr('height', tabHeight);

    d3.select(this).append('text').text(d.name).attr('x', tabHeight / 2).attr('y', -10).style('font-size', textsize * 1.8 > 16 ? 16 : textsize * 1.8).style('font-family', 'Verdana').style('fill', "#000000").attr('transform', 'rotate(90)').style('dominant-baseline', 'middle').style('text-anchor', 'middle');
  }).on('click', clickEventFn);
};

controlBar.bindData = function (data) {
  if (!arguments.length) return dataSet$1;
  dataSet$1 = data;
  return this;
};

controlBar.setHeight = function (data) {
  if (!arguments.length) return height$2;
  height$2 = data;
  return this;
};

controlBar.clickEvent = function (fn) {
  if (!arguments.length) return clickEventFn;
  clickEventFn = fn;
  return this;
};

'use strict';

var metaData$1 = new Array();

var groupLine = function groupLine(x1, x2) {
	return 'M' + x1 + ' 0 v 5' + ' H ' + x2 + ' v -5';
};

var groupsBar = function groupsBar(_selection) {

	_selection.selectAll('*').remove();

	// console.log(metaData)
	var svg = _selection.selectAll('g').data(metaData$1).enter().append('g').attr('id', function (d, i) {
		return d.key;
	}).attr('transform', function (d, i) {
		return d3.zoomIdentity.translate(0, (metaData$1.length - i) * 10 + d3.sum(metaData$1.filter(function (t, index) {
			return index > i;
		}).map(function (t) {
			return t.values.map(function (s) {
				return s.key;
			}).reduce(function (acc, d) {
				return acc >= d.length ? acc : d.length;
			}, 0);
		})) * 6);
	});

	svg.selectAll('path').data(function (d) {
		return d.values;
	}).enter().append('path').attr('d', function (value, i) {
		return groupLine(value.x1, value.x2);
	}).attr('fill', "none").attr("stroke", "#000");

	svg.selectAll('text').data(function (d) {
		return d.values;
	}).enter().append('text').text(function (d) {
		return d.key;
	}).attr('y', function (value, i) {
		return -(value.x1 + value.x2) / 2;
	}).attr('x', 10).style('font-size', '.6em').style('font-family', 'Verdana').style('fill', "#000000").attr('transform', 'rotate(90)').style('dominant-baseline', 'middle').style('text-anchor', 'start');
};
groupsBar.bindData = function (data) {
	if (!arguments.length) return metaData$1;
	metaData$1 = data;

	return this;
};

groupsBar.setXscale = function (fn) {
	if (!arguments.length) return xScale;
	xScale = fn;
	return this;
};

groupsBar.setColor = function (fn) {
	if (!arguments.length) return color;
	color = fn;
	return this;
};

var dataSet$2 = new Array();
var legendBar = function legendBar(_selection) {
		_selection.selectAll('*').remove();

		var textsize = Math.floor(d3.min(dataSet$2.map(function (d) {
				return d.width;
		})) / d3.max(dataSet$2.map(function (d) {
				return d.name.length;
		})));
		_selection.selectAll('g').data(dataSet$2).enter().append('g').attr('transform', function (d, i) {
				return d3.zoomIdentity.translate(d.width * i, 0);
		}).each(function (d, i) {
				d3.select(this).append('rect').attr('fill', d.color).attr('width', d.width).attr('height', d.height);

				d3.select(this).append('text').text(d.name)
				// .style('fill',textColor)
				.style('font-size', textsize * 1.5 > 16 ? 16 : textsize * 1.5).attr('x', d.width / 2).attr('y', d.height / 2).style('dominant-baseline', 'middle').style('text-anchor', 'middle');
		});
};

legendBar.bindData = function (fn) {
		if (!arguments.length) return dataSet$2;
		dataSet$2 = fn;
		return this;
};

var dataSet$3 = { key: 'title', values: new Array() };
var yAxis = null;
var clickEventFn$1 = function clickEventFn(d, i) {
	console.log('click');
};

var plotCanvas = function plotCanvas(_selection) {
	_selection.selectAll('*').remove();
	//yValue
	// var width = d3.max(xScale.range())
	// var yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s"));

	var canvas = _selection.append('g').attr('id', 'plotCanvas');
	//render yAxis
	var chart = canvas.append('g').attr('id', 'plotWin').attr('transform', d3.zoomIdentity.translate(0, 25));

	canvas.append('g').attr('id', 'title').each(function (d) {
		d3.select(this).append('rect').attr('width', dataSet$3.width).attr('height', 20).style('fill', '#fff9e6');
		d3.select(this).append('text').text(dataSet$3.key).attr('x', dataSet$3.width / 2).attr('y', 10).style('fill', "#000000").style('dominant-baseline', 'middle').style('text-anchor', 'middle');
	});
	chart.append("g").attr("id", "yaxis").attr("opacity", 0.6).call(yAxis);

	chart.append("g").attr('id', 'mainParts').selectAll('path').data(dataSet$3.values).enter().append('path').attr('transform', function (d) {
		return d3.zoomIdentity.translate(d.x, d.y);
	}).style("fill", function (t) {
		return t.type === 'line' ? 'none' : t.color;
	}).style("stroke", function (t) {
		return t.type !== 'line' ? null : t.color;
	}).style("stroke-width", function (t) {
		return t.type !== 'line' ? null : '2px';
	}).attr("d", function (t) {
		return t.path;
	})
	// .attr("x", (t)=> t.x)
	// .attr("width", (t)=>t.width)
	// .attr("height",(t)=>t.height)
	// .attr("y", (t)=> t.y)
	.on('click', clickEventFn$1);
};
//getter and setter
plotCanvas.bindData = function (data) {
	if (!arguments.length) return dataSet$3;
	dataSet$3 = data;
	return this;
};

plotCanvas.yAxisFn = function (fn) {
	if (!arguments.length) return yAxis;
	yAxis = fn;
	return this;
};

plotCanvas.clickEvent = function (fn) {
	if (!arguments.length) return clickEventFn$1;
	clickEventFn$1 = fn;
	return this;
};

'use strict';

var plotData = [];
var margin = { top: 20, right: 20, bottom: 20, left: 40 };
var width$2 = 500 - margin.left - margin.right;
var height$3 = 300 - margin.top - margin.bottom;
// var clickEventFn = function(d,i){console.log('click')};
var linePlot = function linePlot(_selection) {
	_selection.selectAll('*').remove();
	if (!plotData.length) return;

	var xScale = d3.scaleLinear().range([0, width$2]);
	var yScale = d3.scaleLinear().range([height$3, 0]);
	var vis = _selection.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var color = d3.scaleOrdinal().range(d3.schemeCategory20);
	var xAxis = d3.axisBottom(xScale);
	var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s"));
	var Xmin = d3.min(plotData.map(function (d) {
		return d3.min(d.values.map(function (t) {
			return t.x;
		}));
	}));
	var Xmax = d3.max(plotData.map(function (d) {
		return d3.max(d.values.map(function (t) {
			return t.x;
		}));
	}));
	var Ymin = d3.min(plotData.map(function (d) {
		return d3.min(d.values.map(function (t) {
			return t.y;
		}));
	}));
	var Ymax = d3.max(plotData.map(function (d) {
		return d3.max(d.values.map(function (t) {
			return t.y;
		}));
	}));
	xScale.domain([Xmin, Xmax]).nice();
	yScale.domain([Ymin, Ymax]).nice();
	var lineFunction = d3.line().x(function (d) {
		return xScale(d.x);
	}).y(function (d) {
		return yScale(d.y);
	}).curve(d3.curveMonotoneX);

	vis.append("g").attr("class", "x axis").attr("transform", "translate(0," + height$3 + ")").call(xAxis).append("text").attr("class", "label").attr("x", width$2).attr("y", -6).style("text-anchor", "end").text("");

	vis.append("g").attr("class", "y axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("");

	vis.append("g").selectAll("path").data(plotData).enter().append("path").attr("class", "line").attr("fill", "none").attr("stroke-width", "1").attr("d", function (d) {
		return lineFunction(d.values);
	}).style("stroke", function (d, i) {
		return color(i);
	}).attr("data-series", function (d) {
		return d.name;
	}).on("mouseover", function (d) {
		vis.append('text').attr('id', 'tip').text(d.name).style('fill', '#000000').attr('x', d3.mouse(this)[0]).attr('y', d3.mouse(this)[1]).style('dominant-baseline', 'middle').style('text-anchor', 'middle');
		d3.select(this).attr("stroke-width", "2.5");
	}).on("mouseout", function (d) {
		vis.select('#tip').remove();
		d3.select(this).attr("stroke-width", "1");
	});
};

linePlot.bindData = function (data) {
	if (!arguments.length) return plotData;
	plotData = data;
	return this;
};

'use strict';

var width$4 = 200;
var height$5 = 25;
var placeholder = 'Select...';
//module events defination
var dispatcher = d3.dispatch('getInput', 'reset');

dispatcher.on('getInput', function (value) {
  console.log(this.value);
});
dispatcher.on('reset', function () {});

var inpoutBox = function inpoutBox(_selection) {
  var inputBox = _selection.append('g').attr('id', 'inputBox').append('foreignObject').attr("width", width$4).attr("height", height$5).append('xhtml:input').style('border', '1px solid #000000').attr('width', '200').attr('placeholder', placeholder).on('keyup', function () {

    dispatcher.call('getInput', this, this.value);
  }).on('click', function () {

    dispatcher.call('getInput', this, this.value);
  });
};

inpoutBox.setInputFn = function (fn) {
  dispatcher.on('getInput', fn);
  return this;
};

inpoutBox.setHeight = function (data) {
  if (!arguments.length) return height$5;
  height$5 = data;
  return this;
};

inpoutBox.setWidth = function (data) {
  if (!arguments.length) return dataset;
  width$4 = data;
  return this;
};

inpoutBox.setPlaceholder = function (data) {
  if (!arguments.length) return placeholder;
  placeholder = data;
  return this;
};

'use strict';

var height$6 = 270;
var width$5 = 10;
var location = 0;
var moveDomain = 100;
var dragEventFn = function dragEventFn(d) {
	console.log(d);
};

var drawRect$1 = function drawRect(x, y, width, height) {
	return 'M' + x + ' ' + y + ' v ' + height + ' h ' + width + ' v -' + height + ' Z';
};

var scrollerButton = function scrollerButton(_selection) {
	_selection.selectAll('*').remove();

	//draw track
	_selection.append('g').append('path').attr('d', 'M ' + width$5 / 2 + ', 0' + 'v ' + height$6).attr('fill', "none").attr("stroke", "#000").attr("stroke-width", '1px');
	//draw button
	var buttonHeight = height$6 * 0.1;
	var buttonWidth = width$5 * 0.7;
	var moveRang = [height$6 * 0.05, height$6 * 0.95];
	var button = _selection.append('g');
	var scaleFn = d3.scaleLinear().range(moveRang).domain([0, moveDomain]);
	button.append('path').attr('d', drawRect$1(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight)).style('fill', '#2E86C1');

	button.attr('transform', d3.zoomIdentity.translate(width$5 / 2, scaleFn(location)));

	button.call(d3.drag().on("drag", dragged));
	function dragged() {
		var yCoordinate = function yCoordinate(a, b, c) {
			return a + b + c - d3.min([a, b, c]) - d3.max([a, b, c]);
		};
		dragEventFn(Math.floor(scaleFn.invert(d3.event.y)));
		d3.select(this).attr('transform', d3.zoomIdentity.translate(width$5 / 2, yCoordinate.apply(undefined, moveRang.concat([d3.event.y]))));
	}
};

scrollerButton.setDomain = function (data) {
	if (!arguments.length) return data;
	moveDomain = data;
	return this;
};

scrollerButton.setLocation = function (data) {
	if (!arguments.length) return data;
	location = data;
	return this;
};

scrollerButton.setDragEvent = function (fn) {
	if (!arguments.length) return fn;
	dragEventFn = fn;
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
var width$3 = 200;
var height$4 = 300;
var rowRanges = d3.range(10);
var showOptions = options.filter(function (d) {
	return d.show;
});
var selectFn = function selectFn(value) {
	console.log(value + ' is selected');
};

var scrollerBar = function scrollerBar(_selection) {
	var _this = this;

	_selection.selectAll('*').remove();
	var cellHeight = (height$4 - 30) / rowRanges.length;
	var cellWidth = width$3;

	var dispatcher = d3.dispatch('updateOpts', 'selectOpt', 'scrollOpts');
	var inputFn = function inputFn(value) {
		options = options.map(function (d) {
			return _extends({}, d, { show: value && d.value.toLowerCase().indexOf(value.toLowerCase()) === -1 ? false : true });
		});
		rowRanges = d3.range(rowRanges.length);
		dispatcher.call('updateOpts', _this, rowRanges);
	};
	var inputPanelFn = inpoutBox.setWidth(width$3).setInputFn(inputFn).setPlaceholder('Searching');
	var inputPanel = _selection.append('g').attr('id', 'inputBox').on('click', function (d) {
		dispatcher.call('updateOpts', this, rowRanges);
	}).call(inputPanelFn);
	var scrollerPanel = _selection.append('g').attr('id', 'scrollerPanel').attr('transform', d3.zoomIdentity.translate(0, 30));
	var selectionPanel = _selection.append('g').attr('id', 'selectionPanel').attr('transform', d3.zoomIdentity.translate(10, 30));

	dispatcher.on('selectOpt', function (opt) {
		options = options.map(function (d) {
			return _extends({}, d, { selected: d.value === opt.value ? true : false });
		}); //change selected opt statu;
		selectFn(opt.value);
		inputPanel.call(inputPanelFn.setPlaceholder(opt.value)); //input show the selected one
		dispatcher.call('updateOpts', this, rowRanges); //opts refreshed
		// selectionPanel.selectAll('*').remove();
	});

	dispatcher.on('scrollOpts', function (step) {
		if (!(step < 0 && d3.min(rowRanges) - 1 === -1) && !(step > 0 && d3.max(rowRanges) + 1 === showOptions.length)) rowRanges = rowRanges.map(function (d) {
			return d + step;
		});

		dispatcher.call('updateOpts', this, rowRanges);
	});

	dispatcher.on('updateOpts', function () {
		var _this2 = this;

		var ranges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [].concat(toConsumableArray(rowRanges));

		selectionPanel.selectAll('*').remove();
		scrollerPanel.selectAll('*').remove();
		showOptions = options.filter(function (d) {
			return d.show;
		});

		selectionPanel.selectAll('g').data(showOptions.filter(function (d, i) {
			return ranges.includes(i);
		})).enter().append('g').each(function (opt, i) {

			var text = opt.value === null ? 'no value' : opt.value.toString();
			var textsize = Math.floor(cellWidth / text.length);

			d3.select(this).attr('transform', d3.zoomIdentity.translate(0, cellHeight * i));
			d3.select(this).append('rect').attr('width', cellWidth).attr('height', cellHeight).attr('fill', opt.selected ? '#f7d0b2' : '#ffffff').style('opacity', 0.8);

			d3.select(this).append('text').text(text).style('fill', '#000000')
			//control text size to include everthing in cell
			.style('font-size', textsize * 2.2 > 16 ? 16 : textsize * 2.2).attr('x', 0).attr('y', cellHeight / 2).style('dominant-baseline', 'middle').style('text-anchor', 'start');
		}).on('click', function (d) {
			return dispatcher.call('selectOpt', _this2, d);
		});

		if (showOptions.length > rowRanges.length) {
			scrollerPanel.call(scrollerButton.setDomain(showOptions.length).setLocation(d3.min(rowRanges)).setDragEvent(function (cur) {
				if (cur >= 0 && cur <= showOptions.length - 9) {
					rowRanges = d3.range(cur, cur + 10);
					dispatcher.call('updateOpts', _this2, rowRanges);
				}
			}));
		}
		selectionPanel.on('mousewheel.zoom', function () {
			if (showOptions.length > rowRanges.length) {
				dispatcher.call('scrollOpts', this, d3.event.wheelDelta < 0 ? 1 : -1);
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
	if (!arguments.length) return height$4;
	height$4 = data;
	return this;
};

scrollerBar.setWidth = function (data) {
	if (!arguments.length) return dataset;
	width$3 = data;
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

'use strict';

var dataSet = new Array();
var metaData = new Array();
var state = { curIndex: 0, chartType: 'bar', std: false };
var width$1 = 800;
var height$1 = 270;
var cellHeight = 20;

//private functions
var getMap = function getMap(data) {
  return data.reduce(function (acc, d, i) {
    acc[i] = d.key;return acc;
  }, {});
};
//draw rect
var drawRect = function drawRect(x, y, width, height) {
  return 'M' + x + ' ' + y + ' v ' + height + ' h ' + width + ' v -' + height + ' Z';
};
var drawCircle = function drawCircle(x, y, radius) {
  return 'M ' + (x - radius) + ' ' + y + ' a ' + radius + ' ' + radius + ', 0, 1, 0, ' + radius * 2 + ' ' + 0 + ' ' + 'a ' + radius + ' ' + radius + ', 0, 1, 0, ' + -radius * 2 + ' ' + 0;
};
var spotfireUI = function spotfireUI(_selection) {
  var _this = this;

  _selection.selectAll('*').remove();

  var chartTypeList = [{ name: 'bar', type: 'bar', color: '#F9D5D3', selected: false }, { name: 'stack', type: 'stackbar', color: '#ECA4A6', selected: false }, { name: 'pie', type: 'grouppie', color: '#807F89', selected: false }, { name: 'line', type: 'stackline', color: '#99A89E', selected: false }, { name: 'std', type: 'std', color: '#BBC7BA', selected: false }].filter(function (d, i) {
    if (metaData.length >= 3) {
      return true;
    } else if (metaData.length == 2) {
      return [0, 3, 4].includes(i);
    } else {
      return [0, 4].includes(i);
    }
  });

  //workflow definition

  var dispatcher = d3.dispatch('chromagraphUI', 'updateUI');

  //create page layout
  var leftBar = _selection.append('g').attr('id', 'leftBar');
  var legendBar$$1 = _selection.append('g').attr('id', 'legendBar').attr('transform', d3.zoomIdentity.translate(30, 0));
  var mainCanvas = _selection.append('g').attr('id', 'mainCanvas').attr('transform', d3.zoomIdentity.translate(30, cellHeight));
  var groupBar = _selection.append('g').attr('id', 'groupBar').attr('transform', d3.zoomIdentity.translate(30, height$1 + cellHeight));
  var lineView = _selection.append('g').attr('id', 'lineView').attr('transform', d3.zoomIdentity.translate(width$1 + 40 + 30 + 200, cellHeight));
  var scrollerBar$$1 = _selection.append('g').attr('id', 'searchBar').attr('transform', d3.zoomIdentity.translate(width$1 + 40 + 30, cellHeight));

  var controlData = function controlData(state) {
    return chartTypeList.map(function (b) {
      var item = {};
      Object.assign(item, b);
      if (b.type === state.chartType) item.selected = true;
      if (state.std && b.type === 'std') item.selected = true;
      return item;
    });
  };

  //update UI
  dispatcher.on('updateUI', function (newState) {

    //metaData = [root-group,first-group,...,lowest-group]
    //dupicate RowData to chartData 
    var chartData = {};
    Object.assign(chartData, dataSet[newState.curIndex]);

    //color function and legend colors according to lowest group categories
    var colorGroup = metaData[metaData.length - 1].values;
    var color = d3.scaleOrdinal().range(d3.schemeCategory20).domain(colorGroup.map(function (d) {
      return d.key;
    }).filter(function (d, i, self) {
      return self.indexOf(d) === i;
    }));
    var legendData = colorGroup.map(function (d) {
      return d.key;
    }).filter(function (d, i, self) {
      return self.indexOf(d) === i;
    }).map(function (c, i, self) {
      return { name: c, color: color(c), width: width$1 / self.length, height: cellHeight };
    });

    // xcMap mantians the color info for each sections:bar_rec/pie_seg 
    var xGroup = [].concat(toConsumableArray(metaData[metaData.length - 1].values));
    var xcMap = getMap(xGroup);

    //stacked style plots use the second last  group to define x-coordinate for each section
    if (newState.chartType.indexOf('stack') !== -1) xGroup = [].concat(toConsumableArray(metaData[metaData.length - 2].values));
    //pie chart/line chart use the tird last group to define x-coordinate for each group
    if (newState.chartType.indexOf('pie') !== -1) xGroup = [].concat(toConsumableArray(metaData[metaData.length - 3].values));

    //get x-coordinate of each section 
    var xScale = d3.scaleBand().range([0, width$1]).paddingInner(0.1).domain(d3.range(xGroup.map(function (d) {
      return d.key;
    }).length));
    //newMap to make sure all x-coordinates in same metric system
    var newMap = xGroup.reduce(function (acc, d, i) {
      var w = xScale.bandwidth() / d.values.length;
      d.values.reduce(function (a, t, j) {
        a[t] = { x1: xScale(i) + w * j, x2: xScale(i) + w * (j + 1) };
        return a;
      }, acc);
      return acc;
    }, {});
    // the info we want to show on xAixs
    var xAxisData = [].concat(toConsumableArray(metaData));
    //if more than one group we default just show the info starts from the  second last group.
    if (metaData.length > 1) xAxisData = metaData.filter(function (d, i, self) {
      return i < self.length - 1;
    });
    //pie chart/line chart we just need show the first group infomation on xAxis
    if (newState.chartType.indexOf('group') !== -1) xAxisData = metaData.filter(function (d, i, self) {
      return i < self.length - 2;
    });

    //prepare the yFn for y-Axis
    var yScale = d3.scaleLinear().range([height$1 - 25, 0]);
    var yAxis = d3.axisRight(yScale);

    //width for submodule to render title bar
    chartData.width = width$1;

    //according to chartType to recalculate Path information for each section.

    if (newState.chartType === 'stackbar') {
      chartData.values = xGroup.reduce(function (acc, g, i) {
        var rows = chartData.values.filter(function (d) {
          return g.values.includes(+d.key);
        }).sort(function (a, b) {
          return +a.key - +b.key;
        });
        var sum$$1 = rows.reduce(function (acc, t) {
          t.prevous = acc;return t.value.y + acc;
        }, 0);
        rows.forEach(function (v) {
          v.type = 'stack';
          v.sum = sum$$1;
          v.x = xScale(i);
          v.width = xScale.bandwidth();
        });
        return [].concat(toConsumableArray(acc), toConsumableArray(rows));
      }, []);

      yScale.domain([0, d3.max(chartData.values.map(function (t) {
        return t.sum;
      }))]);
      chartData.values.forEach(function (d, i) {

        d.y = yScale(d.value.y + d.prevous);
        d.height = height$1 - 25 - yScale(d.value.y);
        d.path = drawRect(0, 0, d.width, d.height);
        d.color = color(xcMap[d.key]);
      });
      yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
    } else if (newState.chartType === 'bar') {

      yScale.domain([0, d3.max(chartData.values.map(function (t) {
        return typeof t.value.std === 'undefined' ? t.value.y : t.value.std + t.value.y;
      }))]);
      yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
      chartData.values.forEach(function (d, i) {
        d.x = newMap[d.key].x1;
        d.width = newMap[d.key].x2 - newMap[d.key].x1;
        d.y = yScale(d.value.y);
        d.height = height$1 - 25 - yScale(d.value.y);
        d.path = drawRect(0, 0, d.width, d.height);
        d.color = color(xcMap[d.key]);
        d.type = 'bar';
      });
      if (newState.std) {
        var stdCircle = chartData.values.filter(function (d) {
          return typeof d.value.std !== 'undefined';
        }).map(function (d) {

          var stdHeight = height$1 - 25 - yScale(d.value.std);
          var item = {};
          item.value = d.value;
          item.type = 'line';
          item.color = '#929293';
          item.x = d.x + d.width / 2;
          item.y = d.y;
          item.path = 'M 0 ' + (0 - stdHeight) + ' v ' + stdHeight * 2 + 'M' + (0 - d.width * 0.5 / 2) + ' ' + (0 - stdHeight) + ' h ' + d.width * 0.5 + ' M' + (0 - d.width * 0.5 / 2) + ' ' + stdHeight + ' h ' + d.width * 0.5;
          return item;
        });
        chartData.values = [].concat(toConsumableArray(chartData.values), toConsumableArray(stdCircle.filter(function (d) {
          return typeof d !== 'undefined';
        })));
      }
    } else if (newState.chartType === 'grouppie') {
      var yMap = getMap(metaData[metaData.length - 2].values);
      yScale = d3.scaleBand().range([0, height$1 - 25]).domain(metaData[metaData.length - 2].values.map(function (d) {
        return d.key;
      }).filter(function (d, i, self) {
        return self.indexOf(d) === i;
      }));
      yAxis = d3.axisRight(yScale).tickSize(width$1);
      var arcFn = d3.arc().innerRadius(0).outerRadius(d3.min([yScale.bandwidth(), xScale.bandwidth()]) / 2);
      var pieFn = d3.pie().sort(function (r) {
        return r.key;
      }).value(function (r) {
        return r.value.y;
      });
      var xMap = xGroup.reduce(function (acc, g, i) {
        return g.values.reduce(function (a, v) {
          a[v] = xScale(i) + xScale.bandwidth() / 2;
          return a;
        }, acc);
      }, {});
      chartData.values = metaData[metaData.length - 2].values.reduce(function (acc, g, i) {

        var rows = chartData.values.filter(function (d) {
          return g.values.includes(+d.key);
        }).sort(function (a, b) {
          return +a.key - +b.key;
        });
        var pathMap = pieFn(rows).map(arcFn);

        rows.forEach(function (v, index) {
          v.x = xMap[+v.key];
          v.y = yScale(yMap[i]) + yScale.bandwidth() / 2;
          v.color = color(xcMap[v.key]);
          v.path = pathMap[index];
          v.type = 'pie';
        });
        return [].concat(toConsumableArray(acc), toConsumableArray(rows));
      }, []);
    } else {

      yScale.domain([0, d3.max(chartData.values.map(function (t) {
        return typeof t.value.std === 'undefined' ? t.value.y : t.value.std + t.value.y;
      }))]);
      yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
      chartData.values = xGroup.reduce(function (acc, g, i) {
        var rows = chartData.values.filter(function (d) {
          return g.values.includes(+d.key);
        }).sort(function (a, b) {
          return +a.key - +b.key;
        });

        rows.forEach(function (v) {
          v.type = 'circle';

          v.x = xScale(i) + xScale.bandwidth() / 2;
          v.width = xScale.bandwidth();
        });
        return [].concat(toConsumableArray(acc), toConsumableArray(rows));
      }, []);

      chartData.values.forEach(function (d, i) {

        d.y = yScale(d.value.y);
        d.height = height$1 - 25 - yScale(d.value.y);
        d.path = drawCircle(0, 0, d.width * 0.1 / 2);
        d.color = color(xcMap[d.key]);
      });
      //add line
      var linefn = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      });
      var lines = d3.nest().key(function (d) {
        return xcMap[d.key];
      }).entries(chartData.values);
      var paths = lines.map(function (d) {
        return d.values;
      }).map(linefn);

      chartData.values = [].concat(toConsumableArray(lines.map(function (l, i) {
        var item = {};
        item.key = l.key;
        item.color = color(l.key);
        item.value = l.values.reduce(function (acc, d) {
          acc.peak_id = [].concat(toConsumableArray(acc.peak_id), toConsumableArray(d.value.peak_id));return acc;
        }, { peak_id: [] });
        item.x = 0;
        item.y = 0;
        item.type = 'line';
        item.path = paths[i];
        return item;
      })), toConsumableArray(chartData.values));
      if (newState.std) {
        var stdCircle = chartData.values.filter(function (d) {
          return d.type !== 'line' && typeof d.value.std !== 'undefined';
        }).map(function (d) {

          var stdHeight = height$1 - 25 - yScale(d.value.std);
          var item = {};
          item.value = d.value;
          item.type = 'line';
          item.color = '#929293';
          item.x = d.x;
          item.y = d.y;
          item.path = 'M 0 ' + (0 - stdHeight) + ' v ' + stdHeight * 2 + 'M' + (0 - d.width * 0.1 / 2) + ' ' + (0 - stdHeight) + ' h ' + d.width * 0.1 + ' M' + (0 - d.width * 0.1 / 2) + ' ' + stdHeight + ' h ' + d.width * 0.1;
          return item;
        });
        chartData.values = [].concat(toConsumableArray(chartData.values), toConsumableArray(stdCircle.filter(function (d) {
          return typeof d !== 'undefined';
        })));
      }
      yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
    }

    // render xAxis

    var groupbarData = xAxisData.map(function (d) {
      var item = {};
      Object.assign(item, d);
      item.values = d.values.map(function (t) {
        return {
          key: t.key,
          x1: newMap[d3.min(t.values)].x1,
          x2: newMap[d3.max(t.values)].x2,
          values: [].concat(toConsumableArray(t.values)) };
      });
      return item;
    });

    //render UI;

    mainCanvas.call(plotCanvas.bindData(chartData).yAxisFn(yAxis).clickEvent(function (d, i) {
      dispatcher.call('chromagraphUI', this, d);
    }));
    legendBar$$1.call(legendBar.bindData(legendData));
    groupBar.call(groupsBar.bindData(groupbarData));
    leftBar.call(controlBar.setHeight(height$1).bindData(controlData(newState)).clickEvent(function (d, i) {
      d.type === 'std' ? state.std = !state.std : state.chartType = d.type;dispatcher.call('updateUI', this, state);
    }));
  });

  //Chart type Change


  //render chromagraphy UI
  dispatcher.on('chromagraphUI', function (rawdata) {
    lineView.selectAll('*').remove();
    //get peakIds from choosen group

    d3.json('http://10.4.1.60/mtb/getData.php?type=mtb_chromat&peak_ids=' + rawdata.value.peak_id.join(','), function (error, data) {
      if (error) return;
      var lines = data.data.values.map(function (d) {
        var line$$1 = {};
        line$$1.name = d.sample_name;
        var x = d.eic_rt.split(',').map(function (d) {
          return Number(d);
        });
        var y = d.eic_intensity.split(',').map(function (d) {
          return Number(d);
        });
        line$$1.values = x.map(function (t, i) {
          return { x: t, y: y[i] };
        }).filter(function (c) {
          return c.x >= Number(d.min_rt) && c.x <= Number(d.max_rt);
        });
        return line$$1;
      });
      lineView.call(linePlot.bindData(lines));
    });
  });

  //mousewheel behavior

  //  _selection.on('mousewheel.zoom',function(d){


  //   lineView.selectAll('*').remove();
  //   let cur = state.curIndex;
  //   if(d3.event.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
  //   else cur = cur-1>=0?cur-1:0;
  //   Object.assign(state,{curIndex:cur});
  //   dispatcher.call('updateUI',this,state);
  // });

  // _selection.node().parentNode.addEventListener("wheel", function(e){
  //   lineView.selectAll('*').remove();
  //   let cur = state.curIndex;
  //   if(e.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
  //   else cur = cur-1>=0?cur-1:0;
  //   Object.assign(state,{curIndex:cur});
  //   dispatcher.call('updateUI',this,state);
  // });

  //searchBar
  var chartOpts = dataSet.map(function (d) {
    return d.key;
  }).filter(function (d) {
    return d;
  });
  var selectChart = function selectChart(value) {
    Object.assign(state, { curIndex: chartOpts.indexOf(value) });
    dispatcher.call('updateUI', _this, state);
  };
  scrollerBar$$1.call(scrollerBar.bindData(chartOpts).setSelectFn(selectChart));

  //default view
  dispatcher.call('updateUI', this, state);
};

//getter and setter
spotfireUI.bindData = function (data) {
  if (!arguments.length) return dataSet;
  dataSet = data;
  state.curIndex = 0;
  return this;
};

spotfireUI.metaData = function (data) {
  if (!arguments.length) return metaData;
  metaData = data;
  return this;
};

spotfireUI.chartType = function (data) {
  if (!arguments.length) return state.chartType;
  state.chartType = data;
  return this;
};

'use strict';

var utility = {};
var sortRules = function sortRules(a, b) {
    if (!parseInt(a) & parseInt(b) >= 0) {
        return -1;
    } else if (!parseInt(b) & parseInt(a) >= 0) {
        return 1;
    } else {
        return d3.ascending(a.toUpperCase(), b.toUpperCase());
    }
};

//get Max and Min of given array;
utility.getScale = function (vals) {
    return vals.reduce(function (acc, cur) {
        return { max: Math.max(acc.max, +cur), min: Math.min(acc.min, +cur) };
    }, { max: +vals[0], min: +vals[0] });
};

//return d3.nest() by given the hierachical groups structure
utility.groupBy = function (groups) {
    var nestfn = d3.nest();
    groups.map(function (f) {
        return function (d) {
            return d[f];
        };
    }).forEach(function (d) {
        return nestfn.key(d);
    });
    return nestfn.sortKeys(sortRules);
};
//flaten NestData
utility.flatenNest = function (data) {
    var _this = this;

    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (Array.isArray(data)) return [{ key: keys, values: data }];else {
        return Object.keys(data).reduce(function (acc, key) {
            return [].concat(toConsumableArray(acc), toConsumableArray(_this.flatenNest(data[key], [].concat(toConsumableArray(keys), [key]))));
        }, []);
    }
};

//get unique values array of give group name list
utility.groupValue = function (dataset, groups) {
    return groups.map(function (d) {
        return dataset.map(function (s) {
            return s[d];
        }).filter(function (v, i, self) {
            return self.indexOf(v) === i;
        });
    });
};
//build the d3.nest structure frame
utility.groupTree = function (groups) {
    return [].concat(toConsumableArray(groups)).reverse().reduce(function (acc, d) {
        return d.reduce(function (a, g) {
            a.push({ key: g });return a;
        }, []).map(function (k) {
            k.values = [].concat(toConsumableArray(acc));return k;
        });
    }, []);
};
//create group frame given gourps posibile value array 
utility.groupFrame = function (groups) {
    return groups.reduce(function (acc, d) {
        var acclength = acc.length > 0 ? d.length * acc[acc.length - 1].length : d.length;
        acc.push(d3.range(acclength).map(function (i) {
            return d[i % d.length];
        }));
        return acc;
    }, []);
};

//get groups combination by given index
utility.groupFn = function (groups) {
    return function (num) {
        return [].concat(toConsumableArray(groups)).reverse().reduce(function (acc, d) {
            acc.push(d[acc[0] % d.length]);acc[0] = Math.floor(acc[0] / d.length);return acc;
        }, [num]).slice(1);
    };
};
//nest dictionary get values
utility.nestFn = function (nestObj) {
    return function (groups) {
        return [].concat(toConsumableArray(groups)).reverse().reduce(function (acc, d) {
            return acc[d] ? acc[d] : [];
        }, nestObj);
    };
};

//sampledata template
var metaData$2 = [{
	name: 'Selection1',
	type: 'single', //* multi/single
	stopBy: false,
	options: [{ name: 'opt1', value: 'opt1', selected: -1 }, { name: 'opt2', value: 'opt2', selected: -1 }, { name: 'opt3', value: 'opt3', selected: -1 }] }, { name: 'Selection2',
	type: 'multi', //* multi/single
	stopBy: false,
	options: [{ name: 'opt1', value: 'opt1', selected: -1 }, { name: 'opt2', value: 'opt2', selected: -1 }, { name: 'opt3', value: 'opt3', selected: -1 }] }];

var cellWidth = 150;
var cellHeight$1 = 25;

var selectionBar = function selectionBar(_selection) {

	var dispatcher = d3.dispatch('updateUI', 'stopBy', 'selectOpt');

	dispatcher.on('stopBy', function (index) {
		var newMetaData = metaData$2.map(function (d) {
			Object.assign(d, { stopBy: false });return d;
		});
		if (index !== null) {
			newMetaData[index].stopBy = true;
		}

		dispatcher.call('updateUI', this, newMetaData);
	});

	dispatcher.on('selectOpt', function (root, opt) {
		var newMetaData = [].concat(toConsumableArray(metaData$2));

		newMetaData.forEach(function (r) {
			if (r.name === root.name) {
				//get current max number
				var maxv = d3.max([0].concat(toConsumableArray(r.options.map(function (d) {
					return d.selected;
				}))));

				//if current option is not selected then if single =0 or multi +1
				var newValue = root.type === 'single' ? 0 : maxv + 1;

				//if current option has value then dis-select it =-1
				if (opt.selected > -1) newValue = -1;

				r.options = root.options.map(function (o, i) {
					var item = {};
					Object.assign(item, o);
					if (root.type === 'single') {
						item.selected = -1;
					}
					//change current opt value
					if (o.name === opt.name) {
						item.selected = newValue;
					}
					//handle the rest
					if (opt.selected > 0 && o.selected > opt.selected) {
						item.selected = o.selected - 1;
					}

					return item;
				});
			}
		});

		dispatcher.call('updateUI', this, newMetaData);
	});

	dispatcher.on('updateUI', function (newMetaData) {
		Object.assign(metaData$2, newMetaData);
		_selection.selectAll('*').remove();
		var roots = _selection.selectAll('g').data(newMetaData).enter().append('g').attr('transform', function (d, i) {
			return d3.zoomIdentity.translate(cellWidth * i, 0);
		}).on('mouseover', function (d, i) {
			dispatcher.call('stopBy', this, i);
		});

		roots.append('text').text(function (d) {
			return d.name;
		}).style('font-size', '1em').attr('x', 0).attr('y', cellHeight$1 / 2).style('dominant-baseline', 'middle').style('text-anchor', 'start');

		roots.each(function (m, ri) {
			d3.select(this).append('g').attr('id', 'opts' + ri).attr('display', m.stopBy ? 'block' : 'none').on('mouseleave', function () {
				dispatcher.call('stopBy', this, null);
			}).selectAll('g').data(m.options).enter().append('g').attr('id', function (t, j) {
				return t.name;
			}).attr('transform', function (t, j) {
				return d3.zoomIdentity.translate(0, cellHeight$1 * (j + 1));
			}).attr('z-index', -1).each(function (t, j) {
				var text = t.name === null ? 'no value' : t.name.toString();
				var textsize = Math.floor(cellWidth / text.length);
				d3.select(this).append('rect').attr('fill', t.selected >= 0 ? '#f7d0b2' : '#ffffff').style('opacity', 0.8).attr('width', cellWidth).attr('height', cellHeight$1).attr('stroke', '#000000');

				d3.select(this).append('text').text(t.name).style('font-size', textsize * 1.8 > 16 ? 16 : textsize * 1.8)
				// .style('font-size','1em')	
				.attr('x', 0).attr('y', cellHeight$1 / 2).style('dominant-baseline', 'middle').style('text-anchor', 'start');

				if (t.selected > 0) {
					d3.select(this).append('text').text(t.selected)
					// .style('fill',textColor)
					.style('font-size', '1em').attr('x', cellWidth).attr('y', cellHeight$1 / 2).style('dominant-baseline', 'middle').style('text-anchor', 'end');
				}
			}).on('mouseover', function () {
				return d3.event.stopPropagation();
			})
			// .on('mouseover.opt',function(d,i){
			// 	d3.select(this).selectAll('rect').attr('fill','#d4d8dd');
			// 	})
			.on('mouseout', function () {
				return d3.event.stopPropagation();
			})
			// .on('mouseleave.opt',function(d,i){
			// 	d3.select(this).selectAll('rect').attr('fill','none');
			// 	})
			.on('click', function (d, j) {
				dispatcher.call('selectOpt', this, m, d);
			});
		});
	});

	dispatcher.call('updateUI', this, metaData$2);
};

selectionBar.bindData = function (data) {
	if (!arguments.length) return metaData$2;
	metaData$2 = data;
	return this;
};

'use strict';

var mavenData = new Array();
var sampleData = new Array();
var trellisOpts = ['compound', 'group_id'];
var yValueOpts = ['area', 'areatop'];
var groupsOpts = ['reagent', 'stime', 'complex', 'dosage', 'cell_origin', 'cell_name', 'drug_sensitivity'];

//get group hierachy info
var getGroupMetaData = function getGroupMetaData(groupList, sampleGroups) {
    return groupList.map(function (g, i) {
        return {
            key: g,
            values: sampleGroups.map(function (t) {
                return t.key.filter(function (k, index) {
                    return index <= i;
                });
            }).reduce(function (acc, sg, j, self) {
                j > 0 && self[j - 1].toString() === sg.toString() ? acc[acc.length - 1].values.push(j) : acc.push({ key: sg[sg.length - 1], values: [j] });
                return acc;
            }, [])
        };
    });
};

//get sampeMap index is the unique group and name will keep the name to identify which level of the groups to determine the color.
var getSampleMap = function getSampleMap(sampleGroups) {
    return sampleGroups.reduce(function (acc, d, i) {
        return d.values.reduce(function (a, v) {
            a[v] = i;return a;
        }, acc);
    }, {});
};
var optionsGenerator = function optionsGenerator(opts, d) {
    return opts.map(function (o, i) {
        var item = {};
        item.name = o;
        item.value = o;
        if (d <= 1) {
            item.selected = i < d ? 0 : -1;
        } else {
            item.selected = i < d ? i + 1 : -1;
        }

        return item;
    });
};
var spotfirePanel = function spotfirePanel(_selection) {
    _selection.selectAll('*').remove();

    var menuBarData = [{
        name: 'trellis By',
        type: 'single', //* multi/single
        stopBy: false,
        options: optionsGenerator(trellisOpts, 1) }, { name: 'y value',
        type: 'single', //* multi/single
        stopBy: false,
        options: optionsGenerator(yValueOpts, 1) }, { name: 'groups By',
        type: 'multi', //* multi/single
        stopBy: false,
        options: optionsGenerator(groupsOpts, 2) }];

    var dispatcher = d3.dispatch('updateUI');
    dispatcher.on('updateUI', function (newData) {

        var trellisGroups = newData[0].options.filter(function (d) {
            return d.selected > -1;
        }).map(function (d) {
            return d.value;
        });
        var yValue = newData[1].options.filter(function (d) {
            return d.selected > -1;
        }).map(function (d) {
            return d.value;
        })[0];
        var dataGroups = newData[2].options.filter(function (d) {
            return d.selected > -1;
        }).sort(function (a, b) {
            return a.selected - b.selected;
        }).map(function (d) {
            return d.value;
        });
        if (d3.min(newData.map(function (d) {
            return d.options.filter(function (d) {
                return d.selected > -1;
            }).length;
        })) === 0) return;
        // console.log(newData.map((d)=>d.options.filter((d)=>d.selected>-1).length))
        //get sample groups 
        var rollupFn = function rollupFn(leave) {
            return d3.mean(leave.map(function (d) {
                return d[yValue];
            }));
        },
            stdFn = function stdFn(leave) {
            return d3.deviation(leave.map(function (d) {
                return d[yValue];
            }));
        };

        var sampleGroups = utility.flatenNest(utility.groupBy(dataGroups).rollup(function (leave) {
            return leave.map(function (d) {
                return d.situation_id;
            });
        }).object(sampleData)).filter(function (d) {
            return !d.key.includes('null');
        });

        var groupMetadata = getGroupMetaData(dataGroups, sampleGroups);
        // console.log(groupMetadata);      
        var sampleMap = getSampleMap(sampleGroups);
        //get mavenData 


        var sampleIds = sampleGroups.reduce(function (acc, d) {
            return [].concat(toConsumableArray(acc), toConsumableArray(d.values));
        }, []);
        var chartData = utility.groupBy(trellisGroups).key(function (d) {
            return sampleMap[d.situation_id];
        }).rollup(function (leave) {
            return { y: rollupFn(leave), std: stdFn(leave), peak_id: leave.map(function (d) {
                    return d.peak_id;
                }) };
        }).entries(mavenData.filter(function (d) {
            return sampleIds.includes(d.situation_id);
        }));

        var uiFn = spotfireUI.bindData(chartData).metaData(groupMetadata);
        plotUI.call(uiFn);
    });

    var plotUI = _selection.append('g').attr('id', 'plotUI').attr('transform', d3.zoomIdentity.translate(0, 25));
    var menuBar = _selection.append('g').attr('id', 'menuBar').attr('transform', d3.zoomIdentity.translate(30, 0));
    menuBar.call(selectionBar.bindData(menuBarData));
    var updateButton = _selection.append('g').attr('id', 'updateButton').attr('transform', d3.zoomIdentity.translate(800 - 150, 2.5));

    updateButton.append('rect').attr('fill', '#2E86C1').style('opacity', 0.8).attr('width', 150).attr('height', 20);

    updateButton.append('text').text('update').style('font-size', '1em').attr('x', 150 / 2).attr('y', 20 / 2).style('dominant-baseline', 'middle').style('text-anchor', 'middle');

    updateButton.on('click', function () {
        dispatcher.call('updateUI', this, menuBarData);
    });

    dispatcher.call('updateUI', this, menuBarData);
};

//setter and getter
spotfirePanel.mavenData = function (data) {
    if (!arguments.length) return mavenData;
    mavenData = data;
    return this;
};
spotfirePanel.trellisOpts = function (groups) {
    if (!arguments.length) return trellisOpts;
    trellisOpts = [].concat(toConsumableArray(groups));
    return this;
};

spotfirePanel.yValueOpts = function (groups) {
    if (!arguments.length) return yValueOpts;
    yValueOpts = [].concat(toConsumableArray(groups));
    return this;
};

spotfirePanel.sampleData = function (data) {
    if (!arguments.length) return sampleData;
    sampleData = data;
    return this;
};

spotfirePanel.groupsOpts = function (groups) {
    if (!arguments.length) return groupsOpts;
    groupsOpts = [].concat(toConsumableArray(groups));
    return this;
};

return spotfirePanel;

})));
