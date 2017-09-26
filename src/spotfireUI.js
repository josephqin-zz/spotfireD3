agios.spotfireUI = (function(){
	'use strict';
	var dataSet = new Array,
	    metaData = new Array,
	    state = {curIndex:0,chartType:'bar'},
		width = 800,
		height = 270,
		cellHeight = 20,
		grinds = {row:2,col:1},
		dataLength = 0;
	
	//private functions
	var getMap = (data) => data.reduce((acc,d,i)=>{acc[i]=d.key;return acc},{});
	

	function exports(_selection){
	_selection.selectAll('*').remove();
	
	//workflow definition
	
	var dispatcher = d3.dispatch('chromagraphUI','updateUI')
	
	//create page layout
	var legendBar = _selection.append('g').attr('id','legendBar');
    var mainCanvas = _selection.append('g').attr('id','mainCanvas').attr('transform',d3.zoomIdentity.translate(0,cellHeight));
    var groupBar = _selection.append('g').attr('id','groupBar').attr('transform',d3.zoomIdentity.translate(0,height+cellHeight));	
    var lineView = _selection.append('g').attr('id','lineView').attr('transform',d3.zoomIdentity.translate(width+40,cellHeight));
  
    //build UI fn 
    // var UIfn = {};
	   //  UIfn.mainCanvasFn = agios.canvasWin.setHeight(height);
	   //  UIfn.groupBarFn = agios.groupsBar;
	   //  ;
	   //  UIfn.legendFn = agios.legendBar;
    
    //update UI
    dispatcher.on('updateUI',function(newState){

       let chartData = Object.assign(dataSet[newState.curIndex]);
       let colorGroup = metaData[metaData.length-1].values;
       let xGroup = [...metaData[metaData.length-1].values];
       let xcMap = getMap(xGroup);// each section:bar_rec/pie_seg has unique x_group_id but share same group_name/color this map to mentain this Info
       
       if(newState.chartType!=='bar') xGroup = [...metaData[metaData.length-2].values];
        
       let color =  d3.scaleOrdinal().range(d3.schemeCategory20).domain(colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i))
       let legendData = colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i).map((c,i,self)=>{return {name:c,color:color(c),width:width/self.length,height:cellHeight}})
       let xScale = d3.scaleBand().range([0, width]).paddingInner(0.1).domain(d3.range(xGroup.map((d)=>d.key).length))
       let newMap = xGroup.reduce((acc,d,i)=>{
			    	let w = xScale.bandwidth()/d.values.length;
			    	d.values.reduce((a,t,j)=>{
			    		     a[t]={x1:xScale(i)+w*j,x2:xScale(i)+w*(j+1)};
			    		     return a;
			    		},acc)
			    	return acc;
			    },{});
                
        let groupbarData = metaData.filter((d,i,self)=>i<self.length-1)
                        .map((d)=>{
                            let item = {};
                            Object.assign(item,d);
                            item.values = d.values.map((t)=>{ return {
                                key:t.key,
                                x1: newMap[d3.min(t.values)].x1,
                                x2: newMap[d3.max(t.values)].x2,
                                values:[...t.values] }

                            });
                            return item;
                        });

        let yScale = d3.scaleLinear().range([height-25,0])

        chartData.width=width;
        if(newState.chartType==='stackbar'){
        chartData.values = xGroup.reduce((acc,g,i)=>{
            let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)) 
            let sum = rows.reduce((acc,t)=>{ t.prevous = acc ; return t.value.y+acc;},0)
            rows.forEach((v)=>{
                v.sum = sum;
                v.x = xScale(i);
                v.width = xScale.bandwidth();  })
            return [...acc,...rows]
        },[])
            
        yScale.domain([0,d3.max(chartData.values.map((t)=>t.sum))])
        chartData.values.forEach((d,i)=>{
            
            d.y = yScale(d.value.y+d.prevous);
            d.height = height-25-yScale(d.value.y);
            d.color = color(xcMap[d.key]);
        })
        


        }else{
        yScale.domain([0,d3.max(chartData.values.map((t)=>t.value.y))])
        chartData.values.forEach((d,i)=>{
            d.x = newMap[d.key].x1;
            d.width = newMap[d.key].x2-newMap[d.key].x1;
            d.y = yScale(d.value.y);
            d.height = height-25-yScale(d.value.y);
            d.color = color(xcMap[d.key]);
        }) 
        }
        var yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);
        
        
        
     	//render UI;
     	mainCanvas.call(agios.plotCanvas.bindData(chartData).yAxisFn(yAxis).clickEvent(function(d,i){dispatcher.call('chromagraphUI',this,d)}));
     	legendBar.call(agios.legendBar.bindData(legendData));
     	groupBar.call(agios.groupsBar.bindData(groupbarData));
        

    });
    	
    //Chart type Change
    

   
    //render chromagraphy UI
    dispatcher.on('chromagraphUI',function(rawdata){
        	lineView.selectAll('*').remove();
        	//get peakIds from choosen group
        	
        	d3.json('http://10.4.1.60/mtb/getData.php?type=mtb_chromat&peak_ids='+rawdata.value.peak_id.join(','),function(error,data){
        		if(error) return;
        		let lines = data.data.values.map((d)=>{
            				  	let line = {};
            				  	line.name = d.sample_name;
            				  	let x = d.eic_rt.split(',').map((d)=>Number(d))
            				  	let y = d.eic_intensity.split(',').map((d)=>Number(d))
            				  	line.values = x.map((t,i)=>{
            				  		return {x:t,y:y[i]}
            				  	}).filter((c)=>c.x>=Number(d.min_rt)&&c.x<=Number(d.max_rt))
            				  	return line;
            				  });
        		lineView.call(agios.linePlot.bindData(lines));
        	})
        	
        });

     //mousewheel behavior
    
    _selection.on('mousewheel.zoom',function(d){
        lineView.selectAll('*').remove();
        let cur = state.curIndex;
    	if(d3.event.wheelDelta>0) cur = cur+1<dataLength?cur+1:dataLength-1;
    	else cur = cur-1>=0?cur-1:0;
    	Object.assign(state,{curIndex:cur});
    	dispatcher.call('updateUI',this,state);
    });

	}
    
    //getter and setter
	exports.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		state.curIndex=0;
		dataLength = data.length;
		return this;
	}

	exports.metaData = function (data){
		if(!arguments.length) return metaData;
		metaData = data;
		return this;
	}

	exports.chartType = function (data){
		if(!arguments.length) return state.chartType;
		state.chartType = data;
		return this;
	}

	return exports;
	})()