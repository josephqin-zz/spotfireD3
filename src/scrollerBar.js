'use strict';
import * as d3 from "d3";
import {default as inputBox} from "./inputBox";
var options=d3.range('100').map((d,i)=>{return {value:'opt'+i,selected:false,show:true}}),
	width=200,
	height=300,
	rowRanges = d3.range(10),
	selectFn = (value)=>{console.log(value+' is selected')};
    

var scrollerBar = function(_selection){
	_selection.selectAll('*').remove();
	let cellHeight = (height-30)/rowRanges.length;
	let cellWidth = width;
    
	let dispatcher = d3.dispatch('updateOpts','selectOpt','autoComplete');
    let inputFn = (value)=>{
		options = options.map((d)=>{return {...d,show:(value && d.value.toLowerCase().indexOf(value)===-1)?false:true}});
		rowRanges = d3.range(rowRanges.length)
		dispatcher.call('updateOpts',this,rowRanges);
	}
    let inputPanelFn = inputBox.setWidth(width).setInputFn(inputFn).setPlaceholder('Searching') 
    let inputPanel = _selection.append('g')
                    .attr('id','inputBox')
                    .on('click',function(d){
                    	dispatcher.call('updateOpts',this,rowRanges);
                    })
                    .call(inputPanelFn);
	let selectionPanel = _selection.append('g').attr('id','selectionPanel').attr('transform',d3.zoomIdentity.translate(0,30));



	dispatcher.on('selectOpt',function(opt){
		options = options.map((d)=>{return {...d,selected:d.value===opt.value?true:false}})
		selectFn(opt.value);
		inputPanel.call(inputPanelFn.setPlaceholder(opt.value));
		selectionPanel.selectAll('*').remove();
	});

	dispatcher.on('updateOpts',function(ranges=[...rowRanges]){
		selectionPanel.selectAll('*').remove();
		let showOptions = options.filter((d)=>d.show);
		selectionPanel.selectAll('g')
				  .data(showOptions.filter((d,i)=>ranges.includes(i)))
				  .enter()
				  .append('g')
				  .each(function(opt,i){
				  	
				  	let text = opt.value===null?'no value':opt.value.toString() 
                    let textsize = Math.floor(cellWidth/text.length);
                    
                    d3.select(this).attr('transform',d3.zoomIdentity.translate(0,cellHeight*i))
    				d3.select(this).append('rect')
    				   				   .attr('width',cellWidth)
    				   				   .attr('height',cellHeight)
    				   				   .attr('fill',opt.selected?'#f7d0b2':'#ffffff')
    				   				   .style('opacity',0.8);

    				d3.select(this).append('text')
    				    			   .text(text)
    				    			   .style('fill','#000000')
                                       //control text size to include everthing in cell
                                       .style('font-size',textsize*2.2>16?16:textsize*2.2)	
    				    			   .attr('x',0)
    				    			   .attr('y',cellHeight/2)
    				    			   .style('dominant-baseline','middle')
    				    			   .style('text-anchor','start')

         			})
				   .on('click',(d)=>dispatcher.call('selectOpt',this,d))

    
			 selectionPanel.on('mousewheel.zoom',function(){
		      if(showOptions.length>rowRanges.length){
		      let step = d3.event.wheelDelta<0?1:-1;
		      if( !( step<0 && d3.min(rowRanges)-1===-1 ) && !( step>0 && d3.max(rowRanges)+1===showOptions.length) )
		      rowRanges = rowRanges.map((d)=>d+step);
			  
		      dispatcher.call('updateOpts',this,rowRanges);
		      }
		    });
    


	})

	
	

	// dispatcher.call('updateOpts',this,rowRanges);
}

scrollerBar.bindData = function(data){
	if(!arguments.length) return options;
	options = [...data.map((d)=>{return {value:d,selected:false,show:true}})];
	return this;
}

scrollerBar.setHeight = function(data){
	if(!arguments.length) return height;
	height = data;
	return this;
}

scrollerBar.setWidth = function(data){
	if(!arguments.length) return dataset;
	width = data;
	return this;
}

scrollerBar.setRow = function(num){
	if(!arguments.length) return rowRanges.length;
	rowRanges = d3.range(num);
	return this;
}

scrollerBar.setSelectFn = function(fn){
	if(!arguments.length) return selectFn;
	selectFn = fn;
	return this;
}


export default scrollerBar;
