agios.canvasWin=(function(){
	'use strict';
	var dataSet = {key:'title',values:new Array},
	    // metaData = new Array,
	    chartType = 'bar',
		// width = 1000,
		height = 300,
		clickEventFn = function(d,i){console.log('click')},
		color = d3.scaleOrdinal().range(d3.schemeCategory20),
		xScale = d3.scaleBand();

	
	function exports(_selection){
		_selection.selectAll('*').remove();
		//yValue
		var width = 1000;
		var yScale = d3.scaleLinear().range([height-20,0]).domain([0,d3.max(dataSet.values.map((t)=>t.value.y))])
	    var yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s"));
		
		var canvas = _selection.append('g').attr('id','plotCanvas');
		//render yAxis
		var chart = canvas.append('g').attr('id','plotWin').attr('transform',d3.zoomIdentity.translate(0,20))
					  
        canvas.append('g').attr('id','title')
				         .each(function(d){
							  	d3.select(this).append('rect')
							  				   .attr('width',width)
							  				   .attr('height',20)
							  				   .style('fill','#fff9e6')
							  	d3.select(this).append('text')
							  				   .text(dataSet.key)
							  				   .attr('x',width/2)
							  				   .attr('y',10)
							  				   .style('fill',"#000000")
							  				   .style('dominant-baseline','middle')
                         	       			   .style('text-anchor','middle')
				  	           });
        chart.append("g")
			    .attr("id", "yaxis")
			    .attr("opacity",0.6)
			    .call(yAxis.tickSize(width))
			    // .selectAll('text')
			    // .attr('y',5)
			    // .attr('x',5)
			    // .attr('text-anchor','start')
			    // .attr('transform','rotate(-90)');

		chart.selectAll('rect')
				.data(dataSet.values)
			    .enter()
				.append('rect')
				.style("fill", (t)=>color(t.key))
				.attr("x", (t)=> xScale(t.key).x1)
				.attr("width", (t)=>xScale(t.key).x2-xScale(t.key).x1)
				.attr("y", (t)=> yScale(t.value.y))
				.attr("height", (t)=> height-20-yScale(t.value.y))
				.on('click',clickEventFn);
					
	}
	//getter and setter
	exports.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}
	// exports.metaData = function (data){
	// 	if(!arguments.length) return metaData;
	// 	metaData = data;
	// 	return this;
	// }
	exports.chartType = function (data){
		if(!arguments.length) return chartType;
		chartType = data;
		return this;
	}

	exports.setXscale = function (fn){
		if(!arguments.length) return xScale;
		xScale = fn;
		return this;
	}

	exports.setColor = function (fn){
		if(!arguments.length) return color;
		color = fn;
		return this;
	}

	exports.setHeight= function (data){
		if(!arguments.length) return win_height;
		height = data;
		return this;
	}

	// exports.setWidth= function (data){
	// 	if(!arguments.length) return win_width;
	// 	win_width = data;
	// 	return this;
	// }
    exports.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
    }
	return exports;
})()