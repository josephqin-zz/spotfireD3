'use strict';
import d3 from 'd3';
var metaData = new Array;
		
	
var groupLine = (x1,x2) => 'M'+x1+' 0 v 5'+' H '+x2+' v -5';

var groupsBar = function (_selection){
		
		_selection.selectAll('*').remove();
		
		
        // console.log(metaData)
        var svg =_selection.selectAll('g')
        		  .data(metaData)
        		  .enter()
        		  .append('g')
        		  .attr('id',(d,i)=>d.key)
        		  .attr('transform',(d,i)=>d3.zoomIdentity.translate(0,(metaData.length-i)*10+d3.sum(metaData.filter((t,index)=>index>i).map((t)=>t.values.map((s)=>s.key).reduce((acc,d)=>acc>=d.length?acc:d.length,0)))*6));
        		  
        		svg.selectAll('path')
				  .data((d)=>d.values)
				  .enter()
				  .append('path')
				  .attr('d',(value,i)=>{
						return groupLine(value.x1,value.x2)
				   })
				  .attr('fill',"none")
	              .attr("stroke","#000");

	            svg.selectAll('text')
	               .data((d)=>d.values)
	               .enter()
	               .append('text')
	               .text((d)=>d.key)
	               .attr('y',(value,i)=>{
						return -(value.x1+value.x2)/2
				   })
				   .attr('x',10)
				   .style('font-size','.6em')
				   .style('font-family','Verdana')
				   .style('fill',"#000000")
				   .attr('transform','rotate(90)')
				   .style('dominant-baseline','middle')
                   .style('text-anchor','start');


	}
    groupsBar.bindData = function (data){
		if(!arguments.length) return metaData;
		metaData = data
		
		return this;
	}
 	
 	groupsBar.setXscale = function (fn){
		if(!arguments.length) return xScale;
		xScale = fn;
		return this;
	}

	groupsBar.setColor = function (fn){
		if(!arguments.length) return color;
		color = fn;
		return this;
	}

export default groupsBar;
