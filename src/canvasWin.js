agios.canvasWin=(function(){
	'use strict';
	var dataSet = new Array,
	    metaData = new Array,
	    chartType = 'bar',
		width = 1000,
		height = 300,
		grinds = {row:2,col:1};

	var getMap = (data) => data.reduce((acc,d)=>d.values.reduce((a,t)=>{ a[t]=d.key ;return a},acc),{});
	function exports(_selection){
		_selection.selectAll('*').remove();
		//add title
		var xMap = getMap(metaData[metaData.length-3].values);
		var color = d3.scaleOrdinal().range(d3.schemeCategory20).domain(Object.values(xMap).filter((d,i,self)=>self.indexOf(d)===i))
		var xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).domain(d3.range(Object.keys(xMap).length));
		
		var chart = _selection.selectAll('g')
					  .data(dataSet.filter((d,i)=>i<6))
					  .enter()
					  .append('g')
					  .attr('id',(d,i)=>'chart'+i)
					  .attr('transform',(d,i)=>d3.zoomIdentity.translate((width+40)*(i%grinds.col),(height+20)*Math.floor(i/grinds.col)));
        chart.append('g').attr('id','title')
				         .each(function(d){
							  	d3.select(this).append('rect')
							  				   .attr('width',width)
							  				   .attr('height',20)
							  				   .style('fill','#fff9e6')
							  	d3.select(this).append('text')
							  				   .text(d.key)
							  				   .attr('x',width/2)
							  				   .attr('y',10)
							  				   .style('fill',"#000000")
							  				   .style('dominant-baseline','middle')
                         	       			   .style('text-anchor','middle')
				  	           });
		chart.append('g').attr('id','main')
						 .attr('transform',d3.zoomIdentity.translate(0,20))
						 .each(function(d){
						 	let yScale = d3.scaleLinear().range([height,0]).domain([0,d3.max(d.values.map((t)=>t.value.y))])
						    let yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s"));
						    

						    d3.select(this).selectAll('rect')
						    			   .data(d.values)
						    			   .enter()
						    			   .append('rect')
						    			   .style("fill", (t)=>color(xMap[t.key]))
							               .attr("x", (t)=> xScale(t.key))
							               .attr("width", xScale.bandwidth())
							               .attr("y", (t)=> yScale(t.value.y))
							               .attr("height", (t)=> height-yScale(t.value.y)); 
							d3.select(this).append("g")
							               .attr("id", "yaxis")
							               .call(yAxis);

							           })
						        



	}
	//getter and setter
	exports.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}
	exports.metaData = function (data){
		if(!arguments.length) return metaData;
		metaData = data;
		return this;
	}
	exports.chartType = function (data){
		if(!arguments.length) return chartType;
		chartType = data;
		return this;
	}

	return exports;
})()