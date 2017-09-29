  'use strict';
  var d3 = require('d3');
  var height = 1000,
    dataSet = [{name:'bar',type:'bar',color:'#F9D5D3',selected:false},
               {name:'stack',type:'stackbar',color:'#ECA4A6',selected:false},
               {name:'pie',type:'grouppie',color:'#807F89',selected:false},
               {name:'line',type:'stackline',color:'#99A89E',selected:false},
               {name:'std',type:'std',color:'#BBC7BA',selected:false}],
      clickEventFn = (d)=>{console.log('click')};

	var renderBar = function(_selection){
		_selection.selectAll('*').remove();
		//render button
		let tabHeight = (height*0.7)/dataSet.length;
		_selection.selectAll('g')
           .data(dataSet)
           .enter()
           .append('g')
           .attr('transform',(t,i)=>d3.zoomIdentity.translate(9,45+(tabHeight+2)*i))
           .each(function(d,i){
                let text = d.name===null?'no value':d.name.toString() 
                let textsize = Math.floor(tabHeight/text.length);
                d3.select(this).append('rect')
                                  .attr('fill',d.color)
                                  .attr('stroke',d.selected?'#000000':'#ffffff')
                                  .attr('stroke-width','1px')
                                  .attr('width',20)
                                  .attr('height',tabHeight);
                
                d3.select(this)
                   .append('text')
                   .text(d.name)
                   .attr('x',tabHeight/2)
                   .attr('y',-10)
                   .style('font-size',textsize*1.8>16?16:textsize*1.8)
                   .style('font-family','Verdana')
                   .style('fill',"#000000")
                   .attr('transform','rotate(90)')
                   .style('dominant-baseline','middle')
                   .style('text-anchor','middle');                  

                })
           .on('click',clickEventFn);

	};


  renderBar.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		return this;
	}

	renderBar.setHeight = function (data){
		if(!arguments.length) return height;
		height = data;
		return this;
	}
	
	
  renderBar.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
  }

  module.exports = renderBar;