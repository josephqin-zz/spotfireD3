agios.spotfireUI = (function(){
	'use strict';
	var dataset = [],
		cols = [d3.range(7).map((d)=>'group'+d),d3.range(2).map((d)=>'group'+d)],
		rows = d3.range(2).map((d)=>{return {key:'sample'+d,values:d3.range(14).map((t)=>{return {key:t,values:d3.range(30)}})}}),
		width = 1000,
		height = 500;
	var color = d3.scaleOrdinal().range(d3.schemeCategory20);
	var clickEventFn = function(d,i){console.log('click');console.log(d)};
	var valueFn = (d)=>d3.mean(d.map((t)=>t));
	var groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v -5'+' h '+width+' v 5';
	
	function exports(_selection){
	    _selection.selectAll('*').remove();
		//draw frame
		var colsX = d3.scaleBand().range([0,width]).domain(d3.range(cols.reduce((acc,d)=>acc*d.length,1)))
		rows.forEach((r)=>{
			r.max = r.values.reduce((acc,d)=>{
				d.y = valueFn(d.values);
				return d3.max([acc,d.y])
			},valueFn(r.values[0].values))
		})

		var grindCol = cols.pop();
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
				 .attr('y',0-width)
				 .attr('transform','rotate(90)')
				 // .style('dominant-baseline','hanging')
		    	 .style('text-anchor','start')
		    	 .style('font-size','1em');
        
        var colsFramedata = agios.groupFrame(cols).reverse();
		var colsFrame = _selection.append('g').attr('id','thead').attr('transform',d3.zoomIdentity.translate(0,height))
							  .selectAll('g')
							  .data(colsFramedata)
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
		    				    			   .attr('y',gid*20+10)
		    				    			   .style('dominant-baseline','hanging')
		    				    			   .style('text-anchor','middle')
		    				    			   .style('font-size','.5em')
							  				  			   

							  })

	    
		rowsFrame.append('g').attr('transform',d3.zoomIdentity.translate(0,(height/rows.length) * 0.05))
		    .each(function(r,i){
			let chartHeight = (height/rows.length) * 0.95
			let yscale=d3.scaleLinear().range([chartHeight,0]).domain([0,r.max])
			d3.select(this).selectAll('rect')
        				   .data(r.values.filter((d)=>d.key!=='undefined'))
        				   .enter()
        				   .append('rect')
        				   .attr('id',(d,i)=>grindCol[d.key%grindCol.length])
        				   .style("fill",(d)=>color(d.key%grindCol.length))
        				   .attr("x",(d)=>colsX(d.key))
        				   .attr("y",(d)=>yscale(d.y))
        				   .attr("width",colsX.bandwidth())
        				   .attr('height',(d)=>chartHeight-yscale(d.y))
        				   .on('click',clickEventFn)
		
		})



						  



	};
    
    exports.columns=function(groups){
    	if(!arguments.length) return cols;
    	cols=[...groups];
    	return this;
    }

    exports.rows = function(data){
    	if(!arguments.length) return rows;
    	rows=[...data];
    	return this;
    }
    
    exports.valueFn = function(fn){
    	if(!arguments.length) return valueFn;
    	valueFn=fn;
    	return this;
    }

    exports.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
    }

	return exports;
})()