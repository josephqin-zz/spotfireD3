agios.plotCanvas=(function(){
	'use strict';
	var dataSet = {key:'title',values:new Array},
	  	yAxis = null,
		clickEventFn = function(d,i){console.log('click')};
	
	function exports(_selection){
		_selection.selectAll('*').remove();
		//yValue
		// var width = d3.max(xScale.range())
		// var yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s"));
		
		var canvas = _selection.append('g').attr('id','plotCanvas');
		//render yAxis
		var chart = canvas.append('g').attr('id','plotWin').attr('transform',d3.zoomIdentity.translate(0,25))
					  
        canvas.append('g').attr('id','title')
				         .each(function(d){
							  	d3.select(this).append('rect')
							  				   .attr('width',dataSet.width)
							  				   .attr('height',20)
							  				   .style('fill','#fff9e6')
							  	d3.select(this).append('text')
							  				   .text(dataSet.key)
							  				   .attr('x',dataSet.width/2)
							  				   .attr('y',10)
							  				   .style('fill',"#000000")
							  				   .style('dominant-baseline','middle')
                         	       			   .style('text-anchor','middle')
				  	           });
        chart.append("g")
			    .attr("id", "yaxis")
			    .attr("opacity",0.6)
			    .call(yAxis)
			   

		chart.selectAll('rect')
				.data(dataSet.values)
			    .enter()
				.append('rect')
				.style("fill", (t)=>t.color)
				.attr("x", (t)=> t.x)
				.attr("width", (t)=>t.width)
				.attr("height",(t)=>t.height)
				.attr("y", (t)=> t.y)
				.on('click',clickEventFn);
					
	}
	//getter and setter
	exports.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}

	exports.yAxisFn = function (fn){
		if(!arguments.length) return yAxis;
		yAxis = fn;
		return this;
	}
	
	
    exports.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
    }
	return exports;
})()