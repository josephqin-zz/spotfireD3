agios.spotfireUI = (function(){
	'use strict';
	var dataset = [],
		cols = [[0,1,2,3,4,5,6],[0,1]],
		rows = d3.range(2).map((d)=>{return {key:'sample'+d,value:d+20}}),
		width = 1000,
		height = 500;
	var color = d3.scaleOrdinal().range(d3.schemeCategory20);
	var groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
	
	function exports(_selection){
	    _selection.selectAll('*').remove();
		//draw frame
		var rowsFrame = _selection.append('g').attr('id','tbody')
								  .selectAll('g')
								  .data(rows)
								  .enter()
								  .append('g')
								  .attr('transform',(d,i)=>d3.zoomIdentity.translate(0,(height/rows.length)*i))
								  .attr('id',(d,i)=>'row'+i);
		rowsFrame.append('text')
				 .style('fill','#000000')	
				 .text((d)=>d.key)
				 .attr('x',width/2)
				 .style('dominant-baseline','hanging')
		    	 .style('text-anchor','middle')
		    	 .style('font-size','1em')		

		var colsFrame = _selection.append('g').attr('id','thead').attr('transform',d3.zoomIdentity.translate(0,height))
							  .selectAll('g')
							  .data(agios.groupFrame(cols).reverse())
							  .enter()
							  .append('g')
							  .attr('id',(d,i)=>'group'+i)
							  .each(function(group,gid){
							  	let xBand = d3.scaleBand().range([0,width]).domain(d3.range(group.length))
							  	d3.select(this).selectAll('path')
							  				   .data(group)
							  				   .enter()
							  				   .append('path')
							  				   .attr('d',(value,i)=>{

							  				   	return groupLine(xBand(i),gid*20+10,xBand.bandwidth())
							  				   })
							  				   .attr('fill',"none")
	              							   .attr("stroke","#000");

	              				d3.select(this).selectAll('text')
							  				   .data(group)
							  				   .enter()
							  				   .append('text')
							  				   .style('fill','#000000')	
							  				   .text((d)=>d)
							  				   .attr('x',(d,i)=>xBand(i)+xBand.bandwidth()/2)
		    				    			   .attr('y',gid*20+5)
		    				    			   .style('dominant-baseline','middle')
		    				    			   .style('text-anchor','middle')
		    				    			   .style('font-size','.5em')
							  				  			   

							  })



	};
    
    exports.columns=function(groups){
    	if(!arguments.length) return cols;
    	cols=groups;
    	return this;
    }


	return exports;
})()