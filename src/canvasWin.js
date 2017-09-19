agios.canvasWin=(function(){
	var dataSet = {title:'test',values:new Array,xFn:},
		width = 1000,
		height = 800;
	function exports(_selection){
		_selection.selectAll('*').remove();
		//add title
		_selection.append('g').attr('id','title')
				  .datum(dataSet.title)
				  .each(function(d){
				  	d3.select(this).append('rect')
				  				   .attr('width',width)
				  				   .attr('height',20)
				  				   .style('fill','#fff9e6')
				  })



	}
	//getter and setter
	exports.bindData(data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}

	return exports;
})()