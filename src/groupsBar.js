agios.groupsBar = (function(){
	'use strict';
	var metaData = new Array,
		width = 1000;
	var getMap = (data) => data.reduce((acc,d)=>d.values.reduce((a,t)=>{ a[t]=d.key ;return a},acc),{});
	var groupLine = (x1,x2) => 'M'+x1+' 0 v 5'+' H '+x2+' v -5';
	function exports(_selection){
		console.log(metaData)
		_selection.selectAll('*').remove();
		//add title
		var xMap = getMap(metaData[metaData.length-1].values);
		var color = d3.scaleOrdinal().range(d3.schemeCategory20).domain(Object.values(xMap).filter((d,i,self)=>self.indexOf(d)===i))
		var xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).domain(d3.range(Object.keys(xMap).length));
        
        _selection.selectAll('g')
        		  .data(metaData)
        		  .enter()
        		  .append('g')
        		  .attr('id',(d,i)=>d.key)
        		  .attr('transform',(d,i)=>d3.zoomIdentity.translate(0,(metaData.length-i)*20))
        		  .selectAll('path')
				  .data((d)=>d.values)
				  .enter()
				  .append('path')
				  .attr('d',(value,i)=>{
						return groupLine(xScale(d3.min(value.values)),xScale(d3.max(value.values))+xScale.bandwidth())
				   })
				  .attr('fill',"none")
	              .attr("stroke","#000");

	}
    exports.bindData = function (data){
		if(!arguments.length) return metaData;
		metaData = data;
		return this;
	}
	return exports;
})()