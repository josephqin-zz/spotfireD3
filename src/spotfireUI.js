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
	//draw rect
    var drawRect = (x,y,width,height) => 'M'+x+' '+y+' v '+height+' h '+width+' v -'+height+' Z';

	function exports(_selection){
	_selection.selectAll('*').remove();
	
	//workflow definition
	
	var dispatcher = d3.dispatch('chromagraphUI','updateUI');
	
	//create page layout
    var leftBar = _selection.append('g').attr('id','leftBar')
	var legendBar = _selection.append('g').attr('id','legendBar').attr('transform',d3.zoomIdentity.translate(30,0));;
    var mainCanvas = _selection.append('g').attr('id','mainCanvas').attr('transform',d3.zoomIdentity.translate(30,cellHeight));
    var groupBar = _selection.append('g').attr('id','groupBar').attr('transform',d3.zoomIdentity.translate(30,height+cellHeight));	
    var lineView = _selection.append('g').attr('id','lineView').attr('transform',d3.zoomIdentity.translate(width+40+30,cellHeight));
    
    //build UI fn 
    // var UIfn = {};
	   //  UIfn.mainCanvasFn = agios.canvasWin.setHeight(height);
	   //  UIfn.groupBarFn = agios.groupsBar;
	   //  ;
	   //  UIfn.legendFn = agios.legendBar;
    
    //update UI
    dispatcher.on('updateUI',function(newState){
        
       //metaData = [root-group,first-group,...,lowest-group]
       //dupicate RowData to chartData 
       let chartData = Object.assign(dataSet[newState.curIndex]);
       

       //color function and legend colors according to lowest group categories
       let colorGroup = metaData[metaData.length-1].values;
       let color =  d3.scaleOrdinal().range(d3.schemeCategory20).domain(colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i))
       let legendData = colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i).map((c,i,self)=>{return {name:c,color:color(c),width:width/self.length,height:cellHeight}})
       
       // xcMap mantians the color info for each sections:bar_rec/pie_seg 
       let xGroup = [...metaData[metaData.length-1].values];
       let xcMap = getMap(xGroup);
       
       //stacked style plots use the second last  group to define x-coordinate for each section
       if(newState.chartType.indexOf('stack')!==-1) xGroup = [...metaData[metaData.length-2].values];
       //pie chart/line chart use the tird last group to define x-coordinate for each group
       if(newState.chartType.indexOf('group')!==-1) xGroup = [...metaData[metaData.length-3].values];
        
       //get x-coordinate of each section 
       let xScale = d3.scaleBand().range([0, width]).paddingInner(0.1).domain(d3.range(xGroup.map((d)=>d.key).length))
       //newMap to make sure all x-coordinates in same metric system
       let newMap = xGroup.reduce((acc,d,i)=>{
			    	let w = xScale.bandwidth()/d.values.length;
			    	d.values.reduce((a,t,j)=>{
			    		     a[t]={x1:xScale(i)+w*j,x2:xScale(i)+w*(j+1)};
			    		     return a;
			    		},acc)
			    	return acc;
			    },{});
        // the info we want to show on xAixs
        let xAxisData = [...metaData];
        //if more than one group we default just show the info starts from the  second last group.
        if(metaData.length>1) xAxisData = metaData.filter((d,i,self)=>i<self.length-1)
        //pie chart/line chart we just need show the first group infomation on xAxis
        if(newState.chartType.indexOf('group')!==-1) xAxisData = metaData.filter((d,i,self)=>i<self.length-2);    
        
        
        //prepare the yFn for y-Axis
        let yScale = d3.scaleLinear().range([height-25,0])
        let yAxis = d3.axisRight(yScale)

        //width for submodule to render title bar
        chartData.width=width;
        

        //according to chartType to recalculate Path information for each section.
        
        if(newState.chartType==='stack'){
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
                    d.path = drawRect(0,0,d.width,d.height)
                    d.color = color(xcMap[d.key]);
                })
           yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);


        }else if(newState.chartType==='bar'){
            yScale.domain([0,d3.max(chartData.values.map((t)=>t.value.y))])
            yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);
            chartData.values.forEach((d,i)=>{
                d.x = newMap[d.key].x1;
                d.width = newMap[d.key].x2-newMap[d.key].x1;
                d.y = yScale(d.value.y);
                d.height = height-25-yScale(d.value.y);
                d.path = drawRect(0,0,d.width,d.height)
                d.color = color(xcMap[d.key]);
            }) 
        }else {
           let yMap = getMap(metaData[metaData.length-2].values);
           
           yScale = d3.scaleBand().range([0,height-25]).domain(metaData[metaData.length-2].values.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i))
           yAxis = d3.axisRight(yScale).tickSize(width);
           let arc = d3.arc().innerRadius(0).outerRadius(d3.min([yScale.bandwidth(),xScale.bandwidth()])/2)
           let pie = d3.pie().sort((r)=>r.key).value((r)=>r.value.y)
           let xMap = xGroup.reduce((acc,g,i)=>g.values.reduce((a,v)=>{
                a[v]=xScale(i)+xScale.bandwidth()/2;
                return a;
           },acc),{})
           
           chartData.values = metaData[metaData.length-2].values.reduce((acc,g,i)=>{ 
                
                let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)) 
                let pathMap = pie(rows).map(arc)
                console.log() 
                rows.forEach((v,index)=>{
                    v.x = xMap[+v.key];
                    v.y = yScale(yMap[i])+yScale.bandwidth()/2;
                    v.color = color(xcMap[v.key]);
                    v.path = pathMap[index];
                    })
                return [...acc,...rows]
            },[])

           
           


        }
        

        // render xAxis
       
        let groupbarData = xAxisData
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

    //default view
    dispatcher.call('updateUI',this,state);
    //render left control the ChartType;
    let tabHeight = height*0.7*0.25
    var chartNames = [{name:'bar',type:'bar'},
                      {name:'stack',type:'stack'},
                      {name:'pie',type:'grouppie'},
                      {name:'line',type:'groupline'}];
    var colorPalletes = ['#1d2120','#5a5c51','#ba9077','#729f98'];
    leftBar.selectAll('g')
           .data(chartNames)
           .enter()
           .append('g')
           .attr('transform',(t,i)=>d3.zoomIdentity.translate(9,45+tabHeight*i))
           .each(function(d,i){
                d3.select(this).append('rect')
                                  .attr('fill',colorPalletes[i])
                                  .attr('width',20)
                                  .attr('height',tabHeight);
                d3.select(this)
                   .append('text')
                   .text(d.name)
                   .attr('x',tabHeight/2)
                   .attr('y',-10)
                   .style('font-size','.6em')
                   .style('font-family','Verdana')
                   .style('fill',"#ffffff")
                   .attr('transform','rotate(90)')
                   .style('dominant-baseline','middle')
                   .style('text-anchor','middle');                  

                })
           .on('click',function(d){
                Object.assign(state,{chartType:d.type});
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