agios.legendBar = (function(){
	var dataSet = new Array;
	function exports(_selection){
		_selection.selectAll('*').remove();
        
        var textsize = Math.floor(d3.min(dataSet.map((d)=>d.width))/d3.max(dataSet.map((d)=>d.name.length)))
		_selection.selectAll('g')
				  .data(dataSet)
				  .enter()
				  .append('g')
				  .attr('transform',(d,i)=>d3.zoomIdentity.translate(d.width*i,0))
				  .each(function(d,i){
				  	d3.select(this).append('rect')
				  	              .attr('fill',d.color)
								  .attr('width',d.width)
								  .attr('height',d.height)
								  
					d3.select(this).append('text')
								  .text(d.name)
								  // .style('fill',textColor)
								  .style('font-size',textsize*1.5)	
						    	  .attr('x',d.width/2)
						    	  .attr('y',d.height/2)
						          .style('dominant-baseline','middle')
						    	  .style('text-anchor','middle')	
				  })
				  	  

	}

	exports.bindData = function(fn){
		if(!arguments.length) return dataSet;
		dataSet = fn;
		return this;
	}

	return exports;
})()