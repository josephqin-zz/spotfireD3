'use strict';
var d3 = require('d3');
var dataSet = {key:'title',values:new Array},
	yAxis = null,
	clickEventFn = function(d,i){console.log('click')};
	
var plotCanvas = function(_selection){
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
			   
        
		chart.append("g").attr('id','mainParts')
				.selectAll('path')
				.data(dataSet.values)
			    .enter()
				.append('path')
				.attr('transform',(d)=>d3.zoomIdentity.translate(d.x,d.y))
				.style("fill", (t)=>t.type==='line'?'none':t.color)
				.style("stroke", (t)=>t.type!=='line'?null:t.color)
				.style("stroke-width", (t)=>t.type!=='line'?null:'2px')
				.attr("d",(t)=>t.path)
				// .attr("x", (t)=> t.x)
				// .attr("width", (t)=>t.width)
				// .attr("height",(t)=>t.height)
				// .attr("y", (t)=> t.y)
				.on('click',clickEventFn);
					
	}
	//getter and setter
plotCanvas.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}

plotCanvas.yAxisFn = function (fn){
		if(!arguments.length) return yAxis;
		yAxis = fn;
		return this;
	}
	
	
plotCanvas.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
    }

module.exports = plotCanvas;    