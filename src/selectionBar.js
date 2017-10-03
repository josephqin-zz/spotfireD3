import d3 from 'd3';
//sampledata template
var metaData = [{
	name:'Selection1',
	type:'single',//* multi/single
	stopBy:false,
	options:[
	{name:'opt1',value:'opt1',selected:-1},
	{name:'opt2',value:'opt2',selected:-1},
	{name:'opt3',value:'opt3',selected:-1}
	]},
	{name:'Selection2',
	type:'multi',//* multi/single
	stopBy:false,
	options:[
	{name:'opt1',value:'opt1',selected:-1},
	{name:'opt2',value:'opt2',selected:-1},
	{name:'opt3',value:'opt3',selected:-1}
	]}]

var cellWidth = 150,
  	cellHeight = 25;




var selectionBar = function(_selection){
	
var dispatcher = d3.dispatch('updateUI','stopBy','selectOpt');

dispatcher.on('stopBy',function(index){
	   let newMetaData = metaData.map((d)=>{ Object.assign(d,{stopBy:false});  return d;});
	   if(index!==null){ newMetaData[index].stopBy = true }
	   	
	   dispatcher.call('updateUI',this,newMetaData);
	})

dispatcher.on('selectOpt',function(root,opt){
	   let newMetaData = [...metaData];
	   
newMetaData.forEach((r)=>{
	   			if(r.name === root.name){
	   				//get current max number
	   				let max = d3.max([0,...r.options.map((d)=>d.selected)]);

					//if current option is not selected then if single =0 or multi +1
					let newValue = root.type==='single'?0:max+1;
					
					//if current option has value then dis-select it =-1
					if (opt.selected>-1) newValue = -1;

	   				r.options = root.options.map((o,i)=>{
	   					let item = {};
	   					Object.assign(item,o);
	   					if(root.type==='single'){ item.selected = -1 }
	   					//change current opt value
	   					if(o.name===opt.name){item.selected = newValue;}
	   					//handle the rest
	   					if(opt.selected>0 && o.selected>opt.selected){ item.selected = o.selected-1 }
	  

	   					return item;
	   				})
	   			}
	   		})
	   

	   dispatcher.call('updateUI',this,newMetaData);
	})
    
	dispatcher.on('updateUI',function(newMetaData){
	Object.assign(metaData,newMetaData);	
	_selection.selectAll('*').remove();	
	var roots = _selection.selectAll('g')
			  .data(newMetaData)
			  .enter()
			  .append('g')
			  .attr('transform',(d,i)=>d3.zoomIdentity.translate(cellWidth*i,0))
			  .on('mouseover',function(d,i){
	          		dispatcher.call('stopBy',this,i);
			   })

	roots.append('text')
		 .text((d)=>d.name)	
		 .style('font-size','1em')	
		 .attr('x',0)
		 .attr('y',cellHeight/2)
		 .style('dominant-baseline','middle')
		 .style('text-anchor','start')

	
			  
	roots
		.each(function(m,ri){
			d3.select(this).append('g')
						   .attr('id','opts'+ri)
						   .attr('display',m.stopBy?'block':'none')
						   .on('mouseleave',function(){
							    dispatcher.call('stopBy',this,null);
							})
						   .selectAll('g')
						   .data(m.options)
						   .enter()
						   .append('g')
						   .attr('id',(t,j)=>t.name)
						   .attr('transform',(t,j)=>d3.zoomIdentity.translate(0,cellHeight*(j+1)))
						   .attr('z-index',-1)
						   .each(function(t,j){
						   	      let text = t.name===null?'no value':t.name.toString() 
                                  let textsize = Math.floor(cellWidth/text.length);
								  d3.select(this).append('rect')
								    .attr('fill',t.selected>=0?'#f7d0b2':'#ffffff')
								    .style('opacity',0.8)
									.attr('width',cellWidth)
									.attr('height',cellHeight)
									.attr('stroke','#000000');
									
															  
								  d3.select(this).append('text')
							        .text(t.name)
									.style('font-size',textsize*1.8>16?16:textsize*1.8)
									// .style('font-size','1em')	
									.attr('x',0)
									.attr('y',cellHeight/2)
									.style('dominant-baseline','middle')
									.style('text-anchor','start')
					                
					              if(t.selected>0){
					                d3.select(this).append('text')
							          .text(t.selected)
									   // .style('fill',textColor)
									  .style('font-size','1em')	
									  .attr('x',cellWidth)
									  .attr('y',cellHeight/2)
									  .style('dominant-baseline','middle')
									  .style('text-anchor','end')
					                }

							})
							.on('mouseover',()=>d3.event.stopPropagation())
							// .on('mouseover.opt',function(d,i){
							// 	d3.select(this).selectAll('rect').attr('fill','#d4d8dd');
							// 	})
							.on('mouseout',()=>d3.event.stopPropagation())
							// .on('mouseleave.opt',function(d,i){
							// 	d3.select(this).selectAll('rect').attr('fill','none');
							// 	})
							.on('click',function(d,j){
								dispatcher.call('selectOpt',this,m,d)
							});



		})
	    
		

	})
	
	dispatcher.call('updateUI',this,metaData);


    }

selectionBar.bindData = function(data){
	if(!arguments.length) return metaData;
		metaData = data;
		return this;
}    

export default selectionBar;