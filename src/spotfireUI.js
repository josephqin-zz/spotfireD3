agios.spotfireUI = (function(){
	'use strict';
	var dataSet = new Array,
	    metaData = new Array,
	    chartType = 'bar',
		width = 500,
		height = 300,
		cellHeight = 20,
		grinds = {row:2,col:1},
		curIndex = 0,
		dataLength = 0;
	//private fun
	var getXscaleFn = (xmap) => d3.scaleBand().rangeRound([0, width]).paddingInner(0.1).domain(d3.range(Object.keys(xmap).length))
    var getColorFn = (xmap) => d3.scaleOrdinal().range(d3.schemeCategory20).domain(Object.values(xmap).filter((d,i,self)=>self.indexOf(d)===i))
    var getMap = (data) => data.reduce((acc,d,i)=>{acc[i]=d.key;return acc},{});
	var getLegendData = (colorFn) => [...colorFn.domain()].map((c,i,self)=>{return {name:c,color:colorFn(c),width:width/self.length,height:cellHeight}})
	function exports(_selection){
	_selection.selectAll('*').remove();
	//workflow
	
	var dispatcher = d3.dispatch('lineUI','updateMetaMap')
	//create page layout
	var legendBar = _selection.append('g').attr('id','legendBar')
    var mainCanvas = _selection.append('g').attr('id','mainCanvas').attr('transform',d3.zoomIdentity.translate(0,cellHeight))
    var groupBar = _selection.append('g').attr('id','groupBar').attr('transform',d3.zoomIdentity.translate(0,height+cellHeight))	
    var lineView = _selection.append('g').attr('id','lineView').attr('transform',d3.zoomIdentity.translate(width+40,cellHeight))
    //prepare meta configration
    // metaData = metaData.filter((d,i,self)=>i<self.length-1)
    // console.log(metaData)
    var xMap = getMap(metaData[metaData.length-1].values);
    var colorBase = getColorFn(xMap);
    var color = (key)=>colorBase(xMap[key]);
    var xScale = getXscaleFn(xMap);
    // console.log(xMap)
    // console.log()
    
    //build UI fn
    var mainCanvasFn = agios.canvasWin.bindData(dataSet[curIndex]).chartType('bar').setColor(color).setXscale(xScale).setHeight(height).clickEvent(function(d,i){dispatcher.call('lineUI',this,d)});
    var groupBarFn = agios.groupsBar.bindData(metaData).setColor(color).setXscale(xScale);
    var lineFn = agios.linePlot
    var legendFn = agios.legendBar.bindData(getLegendData(colorBase));
    //rende UI
    
    // mainCanvas.call(mainCanvasFn);
    groupBar.call(groupBarFn);
    legendBar.call(legendFn);
    _selection.on('mousewheel.zoom',function(d){
        lineView.selectAll('*').remove();
    	if(d3.event.wheelDelta>0) curIndex = curIndex+1<dataLength?curIndex+1:dataLength-1;
    	else curIndex = curIndex-1>=0?curIndex-1:0;
    	mainCanvas.call(mainCanvasFn.bindData(dataSet[curIndex]));
    })

    // dispatcher.on('line')

    dispatcher.on('lineUI',function(rawdata){
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
        		lineView.call(lineFn.bindData(lines));
        	})
        	
        })

	}
    
    //getter and setter
	exports.bindData = function (data){
		if(!arguments.length) return dataSet;
		dataSet = data;
		curIndex = 0;
		dataLength = data.length;
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


	return exports
	})()