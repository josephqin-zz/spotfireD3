(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.spotfirePanel = factory(global.d3));
}(this, (function (d3) { 'use strict';

d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;

'use strict';
  var height$2 = 1000;
	var dataSet$1 = [{name:'bar',type:'bar',color:'#F9D5D3',selected:false},
                 {name:'stack',type:'stackbar',color:'#ECA4A6',selected:false},
                 {name:'pie',type:'grouppie',color:'#807F89',selected:false},
                 {name:'line',type:'stackline',color:'#99A89E',selected:false},
                 {name:'std',type:'std',color:'#BBC7BA',selected:false}];
	var clickEventFn = (d)=>{console.log('click');};

	var controlBar = function (_selection){
		_selection.selectAll('*').remove();
		//render button
		let tabHeight = (height$2*0.7)/dataSet$1.length;
		_selection.selectAll('g')
           .data(dataSet$1)
           .enter()
           .append('g')
           .attr('transform',(t,i)=>d3.zoomIdentity.translate(9,45+(tabHeight+2)*i))
           .each(function(d,i){
                let text = d.name===null?'no value':d.name.toString(); 
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


  controlBar.bindData = function (data){
		if(!arguments.length) return dataSet$1;
		dataSet$1 = data;
		return this;
	};

	controlBar.setHeight = function (data){
		if(!arguments.length) return height$2;
		height$2 = data;
		return this;
	};
	
	
  controlBar.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn;
    	clickEventFn=fn;
    	return this;
    };

'use strict';
var metaData$1 = new Array;
		
	
var groupLine = (x1,x2) => 'M'+x1+' 0 v 5'+' H '+x2+' v -5';

var groupsBar = function (_selection){
		
		_selection.selectAll('*').remove();
		
		
        // console.log(metaData)
        var svg =_selection.selectAll('g')
        		  .data(metaData$1)
        		  .enter()
        		  .append('g')
        		  .attr('id',(d,i)=>d.key)
        		  .attr('transform',(d,i)=>d3.zoomIdentity.translate(0,(metaData$1.length-i)*10+d3.sum(metaData$1.filter((t,index)=>index>i).map((t)=>t.values.map((s)=>s.key).reduce((acc,d)=>acc>=d.length?acc:d.length,0)))*6));
        		  
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


	};
    groupsBar.bindData = function (data){
		if(!arguments.length) return metaData$1;
		metaData$1 = data;
		
		return this;
	};
 	
 	groupsBar.setXscale = function (fn){
		if(!arguments.length) return xScale;
		xScale = fn;
		return this;
	};

	groupsBar.setColor = function (fn){
		if(!arguments.length) return color;
		color = fn;
		return this;
	};

var dataSet$2 = new Array;
var legendBar =function(_selection){
		_selection.selectAll('*').remove();
        
        var textsize = Math.floor(d3.min(dataSet$2.map((d)=>d.width))/d3.max(dataSet$2.map((d)=>d.name.length)));
		_selection.selectAll('g')
				  .data(dataSet$2)
				  .enter()
				  .append('g')
				  .attr('transform',(d,i)=>d3.zoomIdentity.translate(d.width*i,0))
				  .each(function(d,i){
				  	d3.select(this).append('rect')
				  	              .attr('fill',d.color)
								  .attr('width',d.width)
								  .attr('height',d.height);
								  
					d3.select(this).append('text')
								  .text(d.name)
								  // .style('fill',textColor)
								  .style('font-size',textsize*1.5>16?16:textsize*1.5)	
						    	  .attr('x',d.width/2)
						    	  .attr('y',d.height/2)
						          .style('dominant-baseline','middle')
						    	  .style('text-anchor','middle');	
				  });
				  	  

	};

legendBar.bindData = function(fn){
		if(!arguments.length) return dataSet$2;
		dataSet$2 = fn;
		return this;
	};

'use strict';
var dataSet$3 = {key:'title',values:new Array};
var yAxis = null;
var clickEventFn$1 = function(d,i){console.log('click');};
	
var plotCanvas = function(_selection){
		_selection.selectAll('*').remove();
		//yValue
		// var width = d3.max(xScale.range())
		// var yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s"));
		
		var canvas = _selection.append('g').attr('id','plotCanvas');
		//render yAxis
		var chart = canvas.append('g').attr('id','plotWin').attr('transform',d3.zoomIdentity.translate(0,25));
					  
        canvas.append('g').attr('id','title')
				         .each(function(d){
							  	d3.select(this).append('rect')
							  				   .attr('width',dataSet$3.width)
							  				   .attr('height',20)
							  				   .style('fill','#fff9e6');
							  	d3.select(this).append('text')
							  				   .text(dataSet$3.key)
							  				   .attr('x',dataSet$3.width/2)
							  				   .attr('y',10)
							  				   .style('fill',"#000000")
							  				   .style('dominant-baseline','middle')
                         	       			   .style('text-anchor','middle');
				  	           });
        chart.append("g")
			    .attr("id", "yaxis")
			    .attr("opacity",0.6)
			    .call(yAxis);
			   
        
		chart.append("g").attr('id','mainParts')
				.selectAll('path')
				.data(dataSet$3.values)
			    .enter()
				.append('path')
				.attr('transform',(d)=>d3.zoomIdentity.translate(d.x,d.y))
				.style("fill", (t)=>t.type==='line'?'none':t.color)
				.style("stroke", (t)=>t.type!=='line'?null:t.color)
				.style("stroke-width", (t)=>t.type!=='line'?null:'2px')
				.attr("d",(t)=>t.path)
				// .attr("x", (t)=> t.x)
				// .attr("width", (t)=>t.width)
				// .attr("height",(t)=>t.height)
				// .attr("y", (t)=> t.y)
				.on('click',clickEventFn$1);
					
	};
	//getter and setter
plotCanvas.bindData = function (data){
		if(!arguments.length) return dataSet$3;
		dataSet$3 = data;
		return this;
	};

plotCanvas.yAxisFn = function (fn){
		if(!arguments.length) return yAxis;
		yAxis = fn;
		return this;
	};
	
	
plotCanvas.clickEvent = function(fn){
    	if(!arguments.length) return clickEventFn$1;
    	clickEventFn$1=fn;
    	return this;
    };

'use strict';
var plotData = [];
var margin = {top: 20, right: 20, bottom: 20, left: 40};
var width$2 = 500 - margin.left - margin.right;
var height$3 = 300 - margin.top - margin.bottom;
	// var clickEventFn = function(d,i){console.log('click')};
var linePlot = function(_selection){
		_selection.selectAll('*').remove();
		if(!plotData.length) return;
		
		var xScale = d3.scaleLinear().range([0, width$2]);
		var yScale = d3.scaleLinear().range([height$3, 0]);	    
		var vis = _selection.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var color = d3.scaleOrdinal().range(d3.schemeCategory20);
		var xAxis = d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s"));
		let Xmin = d3.min(plotData.map((d)=>d3.min(d.values.map((t)=>(t.x)))));
        let Xmax = d3.max(plotData.map((d)=>d3.max(d.values.map((t)=>(t.x)))));
        let Ymin = d3.min(plotData.map((d)=>d3.min(d.values.map((t)=>(t.y)))));
        let Ymax = d3.max(plotData.map((d)=>d3.max(d.values.map((t)=>(t.y)))));
		xScale.domain([Xmin,Xmax]).nice();
		yScale.domain([Ymin,Ymax]).nice();
		let lineFunction = d3.line()
                               .x(function (d) {return xScale(d.x);})
                               .y(function (d) {return yScale(d.y);})
                               .curve(d3.curveMonotoneX);
		
		vis.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height$3 + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "label")
			.attr("x", width$2)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("");

		vis.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("");

			vis.append("g")
			.selectAll("path")
			.data(plotData)
			.enter().append("path")
			.attr("class","line")
			.attr("fill","none")
			.attr("stroke-width","1")
			.attr("d",function(d){return lineFunction(d.values)})
			.style("stroke",function(d,i){return color(i)})
			.attr("data-series",function(d){return d.name})
			.on("mouseover", function(d) {
				vis.append('text')
				.attr('id','tip')
				.text(d.name)
				.style('fill','#000000')  
				.attr('x',d3.mouse(this)[0])
				.attr('y',d3.mouse(this)[1])
				.style('dominant-baseline','middle')
				.style('text-anchor','middle');
				d3.select(this).attr("stroke-width","2.5");

			})					
			.on("mouseout", function(d) {		
				vis.select('#tip').remove();	
				d3.select(this).attr("stroke-width","1");
			});								  	  

	};

linePlot.bindData=function(data){
		if(!arguments.length) return plotData;
		plotData = data;
		return this;
	};

'use strict'; 
  var dataSet = new Array;
  var metaData = new Array;
  var state = {curIndex:0,chartType:'bar',std:false};
  var width$1 = 800;
  var height$1 = 270;
  var cellHeight = 20;
  var dataLength = 0;

  //private functions
  var getMap = (data) => data.reduce((acc,d,i)=>{acc[i]=d.key;return acc},{});
  //draw rect
  var drawRect = (x,y,width,height) => 'M'+x+' '+y+' v '+height+' h '+width+' v -'+height+' Z';
  var drawCircle = (x,y,radius) => 'M '+(0-radius)+' '+y+' a '+radius+' '+radius+', 0, 1, 0, '+(radius*2)+' '+y+' '+'a '+radius+' '+radius+', 0, 1, 0, '+(-radius*2)+' '+y;
  var spotfireUI = function(_selection){
  _selection.selectAll('*').remove();

  //workflow definition

  var dispatcher = d3.dispatch('chromagraphUI','updateUI');

  //create page layout
  var leftBar = _selection.append('g').attr('id','leftBar');
  var legendBar$$1 = _selection.append('g').attr('id','legendBar').attr('transform',d3.zoomIdentity.translate(30,0));
  var mainCanvas = _selection.append('g').attr('id','mainCanvas').attr('transform',d3.zoomIdentity.translate(30,cellHeight));
  var groupBar = _selection.append('g').attr('id','groupBar').attr('transform',d3.zoomIdentity.translate(30,height$1+cellHeight));	
  var lineView = _selection.append('g').attr('id','lineView').attr('transform',d3.zoomIdentity.translate(width$1+40+30,cellHeight));


  var controlData = (state)=>[{name:'bar',type:'bar',color:'#F9D5D3',selected:false},
  {name:'stack',type:'stackbar',color:'#ECA4A6',selected:false},
  {name:'pie',type:'grouppie',color:'#807F89',selected:false},
  {name:'line',type:'stackline',color:'#99A89E',selected:false},
  {name:'std',type:'std',color:'#BBC7BA',selected:false}].map((b)=>{
    let item = {};
    Object.assign(item,b);
    if (b.type === state.chartType) item.selected=true;
    if (state.std && b.type==='std') item.selected=true;
    return item;
  });


    //update UI
    dispatcher.on('updateUI',function(newState){

       //metaData = [root-group,first-group,...,lowest-group]
       //dupicate RowData to chartData 
       let chartData = {};
       Object.assign(chartData,dataSet[newState.curIndex]);
       

       //color function and legend colors according to lowest group categories
       let colorGroup = metaData[metaData.length-1].values;
       let color =  d3.scaleOrdinal().range(d3.schemeCategory20).domain(colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i));
       let legendData = colorGroup.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i).map((c,i,self)=>{return {name:c,color:color(c),width:width$1/self.length,height:cellHeight}});
       
       // xcMap mantians the color info for each sections:bar_rec/pie_seg 
       let xGroup = [...metaData[metaData.length-1].values];
       let xcMap = getMap(xGroup);
       
       //stacked style plots use the second last  group to define x-coordinate for each section
       if(newState.chartType.indexOf('stack')!==-1) xGroup = [...metaData[metaData.length-2].values];
       //pie chart/line chart use the tird last group to define x-coordinate for each group
       if(newState.chartType.indexOf('pie')!==-1) xGroup = [...metaData[metaData.length-3].values];

       //get x-coordinate of each section 
       let xScale = d3.scaleBand().range([0, width$1]).paddingInner(0.1).domain(d3.range(xGroup.map((d)=>d.key).length));
       //newMap to make sure all x-coordinates in same metric system
       let newMap = xGroup.reduce((acc,d,i)=>{
         let w = xScale.bandwidth()/d.values.length;
         d.values.reduce((a,t,j)=>{
           a[t]={x1:xScale(i)+w*j,x2:xScale(i)+w*(j+1)};
           return a;
         },acc);
         return acc;
       },{});
        // the info we want to show on xAixs
        let xAxisData = [...metaData];
        //if more than one group we default just show the info starts from the  second last group.
        if(metaData.length>1) xAxisData = metaData.filter((d,i,self)=>i<self.length-1);
        //pie chart/line chart we just need show the first group infomation on xAxis
      if(newState.chartType.indexOf('group')!==-1) xAxisData = metaData.filter((d,i,self)=>i<self.length-2);    


        //prepare the yFn for y-Axis
        let yScale = d3.scaleLinear().range([height$1-25,0]);
        let yAxis = d3.axisRight(yScale);

        //width for submodule to render title bar
        chartData.width=width$1;
        

        //according to chartType to recalculate Path information for each section.
        
        if(newState.chartType==='stackbar'){
          chartData.values = xGroup.reduce((acc,g,i)=>{
            let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)); 
            let sum = rows.reduce((acc,t)=>{ t.prevous = acc ; return t.value.y+acc;},0);
            rows.forEach((v)=>{
              v.type='stack';
              v.sum = sum;
              v.x = xScale(i);
              v.width = xScale.bandwidth();  });
            return [...acc,...rows]
          },[]);

          yScale.domain([0,d3.max(chartData.values.map((t)=>t.sum))]);
          chartData.values.forEach((d,i)=>{

            d.y = yScale(d.value.y+d.prevous);
            d.height = height$1-25-yScale(d.value.y);
            d.path = drawRect(0,0,d.width,d.height);
            d.color = color(xcMap[d.key]);
          });
          yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);


        }else if(newState.chartType==='bar'){

          yScale.domain([0,d3.max(chartData.values.map((t)=>typeof t.value.std==='undefined'?t.value.y:t.value.std+t.value.y))]);
          yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
          chartData.values.forEach((d,i)=>{
            d.x = newMap[d.key].x1;
            d.width = newMap[d.key].x2-newMap[d.key].x1;
            d.y = yScale(d.value.y);
            d.height = height$1-25-yScale(d.value.y);
            d.path = drawRect(0,0,d.width,d.height);
            d.color = color(xcMap[d.key]);
            d.type='bar';
          });
          if(newState.std){
            var stdCircle = chartData.values.filter((d)=>typeof d.value.std!=='undefined').map((d)=>{

              let stdHeight = height$1-25-yScale(d.value.std);
              let item = {};
              item.value = d.value;
              item.type='line';
              item.color='#929293';
              item.x=d.x+d.width/2;
              item.y=d.y;
              item.path = 'M 0 '+(0-stdHeight)+' v '+stdHeight*2 + 'M'+(0-d.width*0.5/2)+' '+(0-stdHeight)+' h '+d.width*0.5+' M'+(0-d.width*0.5/2)+' '+stdHeight+' h '+d.width*0.5;
              return item;
            });
            chartData.values = [...chartData.values,...stdCircle.filter((d)=>typeof d!=='undefined')];

          } 
        }else if(newState.chartType==='grouppie'){
         let yMap = getMap(metaData[metaData.length-2].values);
         yScale = d3.scaleBand().range([0,height$1-25]).domain(metaData[metaData.length-2].values.map((d)=>d.key).filter((d,i,self)=>self.indexOf(d)===i));
         yAxis = d3.axisRight(yScale).tickSize(width$1);
         let arc = d3.arc().innerRadius(0).outerRadius(d3.min([yScale.bandwidth(),xScale.bandwidth()])/2);
         let pie = d3.pie().sort((r)=>r.key).value((r)=>r.value.y);
         let xMap = xGroup.reduce((acc,g,i)=>g.values.reduce((a,v)=>{
          a[v]=xScale(i)+xScale.bandwidth()/2;
          return a;
        },acc),{});
         chartData.values = metaData[metaData.length-2].values.reduce((acc,g,i)=>{ 

          let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)); 
          let pathMap = pie(rows).map(arc);
          console.log(); 
          rows.forEach((v,index)=>{
            v.x = xMap[+v.key];
            v.y = yScale(yMap[i])+yScale.bandwidth()/2;
            v.color = color(xcMap[v.key]);
            v.path = pathMap[index];
            v.type = 'pie';
          });
          return [...acc,...rows]
        },[]);


       }else{

        yScale.domain([0,d3.max(chartData.values.map((t)=>typeof t.value.std==='undefined'?t.value.y:t.value.std+t.value.y))]);
        yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
        chartData.values = xGroup.reduce((acc,g,i)=>{
          let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)); 

          rows.forEach((v)=>{
            v.type='circle';

            v.x = xScale(i)+xScale.bandwidth()/2;
            v.width = xScale.bandwidth();  });
          return [...acc,...rows]

        },[]);



        chartData.values.forEach((d,i)=>{

          d.y = yScale(d.value.y);
          d.height = height$1-25-yScale(d.value.y);
          d.path = drawCircle(0,0,d.width*0.1/2);
          d.color = color(xcMap[d.key]);
        });
            //add line
            let linefn = d3.line().x((d)=>d.x).y((d)=>d.y);
            let lines = d3.nest().key((d)=>xcMap[d.key]).entries(chartData.values);
            let paths = lines.map((d)=>d.values).map(linefn);
            
            chartData.values = [...lines.map((l,i)=>{
              let item = {};
              item.key = l.key;
              item.color = color(l.key);
              item.value = l.values.reduce((acc,d)=>{ acc.peak_id = [...acc.peak_id ,...d.value.peak_id];return acc },{peak_id:[]});
              item.x = 0;
              item.y = 0;
              item.type = 'line';
              item.path = paths[i];
              return item;
            }),...chartData.values];
            if(newState.std){
              var stdCircle = chartData.values.filter((d)=>d.type!=='line'&& typeof d.value.std!=='undefined').map((d)=>{

                let stdHeight = height$1-25-yScale(d.value.std);
                let item = {};
                item.value = d.value;
                item.type='line';
                item.color='#929293';
                item.x=d.x;
                item.y=d.y;
                item.path = 'M 0 '+(0-stdHeight)+' v '+stdHeight*2 + 'M'+(0-d.width*0.1/2)+' '+(0-stdHeight)+' h '+d.width*0.1+' M'+(0-d.width*0.1/2)+' '+stdHeight+' h '+d.width*0.1;
                return item;
              });
              chartData.values = [...chartData.values,...stdCircle.filter((d)=>typeof d!=='undefined')];

            }
            yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width$1);
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

     	mainCanvas.call(plotCanvas.bindData(chartData).yAxisFn(yAxis).clickEvent(function(d,i){dispatcher.call('chromagraphUI',this,d);}));
     	legendBar$$1.call(legendBar.bindData(legendData));
     	groupBar.call(groupsBar.bindData(groupbarData));
      leftBar.call(controlBar.setHeight(height$1).bindData(controlData(newState)).clickEvent(function(d,i){ d.type==='std'?state.std=!state.std:state.chartType=d.type;dispatcher.call('updateUI',this,state); }));  

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
             let x = d.eic_rt.split(',').map((d)=>Number(d));
             let y = d.eic_intensity.split(',').map((d)=>Number(d));
             line.values = x.map((t,i)=>{
              return {x:t,y:y[i]}
            }).filter((c)=>c.x>=Number(d.min_rt)&&c.x<=Number(d.max_rt));
             return line;
           });
        		lineView.call(linePlot.bindData(lines));
        	});
        	
        });

     //mousewheel behavior

     _selection.on('mousewheel.zoom',function(d){
      

      lineView.selectAll('*').remove();
      let cur = state.curIndex;
      if(d3.event.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
      else cur = cur-1>=0?cur-1:0;
      Object.assign(state,{curIndex:cur});
      dispatcher.call('updateUI',this,state);
    });

    // _selection.node().parentNode.addEventListener("wheel", function(e){
    //   lineView.selectAll('*').remove();
    //   let cur = state.curIndex;
    //   if(e.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
    //   else cur = cur-1>=0?cur-1:0;
    //   Object.assign(state,{curIndex:cur});
    //   dispatcher.call('updateUI',this,state);
    // });

    //default view
    dispatcher.call('updateUI',this,state);

  };

    //getter and setter
  spotfireUI.bindData = function (data){
     if(!arguments.length) return dataSet;
     dataSet = data;
     state.curIndex=0;
     dataLength = data.length;
     return this;
   };

  spotfireUI.metaData = function (data){
     if(!arguments.length) return metaData;
     metaData = data;
     return this;
   };

  spotfireUI.chartType = function (data){
     if(!arguments.length) return state.chartType;
     state.chartType = data;
     return this;
   };

'use strict';
    var utility = {};


    //get Max and Min of given array;
    utility.getScale = function(vals){
            return vals.reduce( (acc,cur) => {return {max:Math.max(acc.max,+cur),min:Math.min(acc.min,+cur)} } ,{max:+vals[0],min:+vals[0]} )
        };

    //return d3.nest() by given the hierachical groups structure
    utility.groupBy = function(groups){
        let nest = d3.nest();
        groups.map((f)=>((d)=>d[f])).forEach((d)=>nest.key(d));
        return nest.sortKeys(d3.ascending);
    };
    //flaten NestData
    utility.flatenNest = function (data,keys=[]){
        if (Array.isArray(data)) return [{key:keys,values:data}]
        else 
            {  
               return Object.keys(data).reduce((acc,key)=>[...acc,...this.flatenNest(data[key],[...keys,key])],[])
            } 
    };
    
        
    //get unique values array of give group name list
    utility.groupValue = function(dataset,groups){
        return groups.map((d)=>dataset.map((s)=>s[d]).filter((v,i,self)=>self.indexOf(v)===i))
    }; 
    //build the d3.nest structure frame
    utility.groupTree = function(groups){
        return [...groups].reverse()
                          .reduce((acc,d)=>d.reduce((a,g)=>{a.push({key:g}); return a},[]).map((k)=>{k.values=[...acc];return k}),[])
    };
    //create group frame given gourps posibile value array 
    utility.groupFrame = function(groups){
        return groups.reduce((acc,d)=>{ 
                     let acclength = acc.length>0?d.length*acc[acc.length-1].length:d.length; 
                     acc.push(d3.range(acclength).map((i)=>d[i%d.length])); 
                     return acc; 
                    },[])
    };
    
    //get groups combination by given index
    utility.groupFn = (groups)=> (num)=>[...groups].reverse().reduce((acc,d)=>{ acc.push(d[acc[0]%(d.length)]);acc[0]=Math.floor(acc[0]/(d.length));return acc},[num]).slice(1);
    //nest dictionary get values
    utility.nestFn = (nestObj)=> (groups)=>[...groups].reverse().reduce((acc,d)=>acc[d]?acc[d]:[],nestObj);

'use strict';
var mavenData = new Array;
var sampleData = new Array;
var trellisGroups = new Array;
var dataGroups = new Array;
var rollupFn = (leave)=>d3.mean(leave.map((d)=>d.areatop));
var stdFn = (leave)=>d3.deviation(leave.map((d)=>d.areatop));
    
    //get group hierachy info
    var getGroupMetaData = (groupList,sampleGroups) => groupList.map((g,i)=>{return {
            key:g,
            values:sampleGroups.map((t)=>t.key.filter((k,index)=>index<=i))
                               .reduce((acc,sg,j,self)=>{
                                (j>0 && self[j-1].toString()===sg.toString())?acc[acc.length-1].values.push(j):acc.push({key:sg[sg.length-1],values:[j]});
                                return acc;},
                                [])
            } 
        });
    
    //get sampeMap index is the unique group and name will keep the name to identify which level of the groups to determine the color.
    var getSampleMap = (sampleGroups) => sampleGroups.reduce((acc,d,i)=>d.values.reduce((a,v)=>{ a[v]=i;return a },acc),{});

	var spotfirePanel = function(_selection){
        _selection.selectAll('*').remove();

        
        var menuBar = _selection.append('g').attr('id','menuBar');
        var plotUI = _selection.append('g').attr('id','plotUI');



        //get sample groups 
        var sampleGroups = utility.flatenNest(utility.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData)).filter((d)=>!d.key.includes('null'));
        
        var groupMetadata = getGroupMetaData(dataGroups,sampleGroups);
              
        var sampleMap = getSampleMap(sampleGroups);
        //get mavenData 
        
        
        var sampleIds = sampleGroups.reduce((acc,d)=>[...acc,...d.values],[]);
        var chartData = utility.groupBy(trellisGroups).key((d)=>sampleMap[d.sample_id]).rollup((leave)=>{return {y:rollupFn(leave),std:stdFn(leave),peak_id:leave.map((d)=>d.peak_id)}}).entries(mavenData.filter((d)=>sampleIds.includes(d.sample_id)));
        
        var uiFn = spotfireUI.bindData(chartData).metaData(groupMetadata);
        plotUI.call(uiFn);
       

	};

    //setter and getter
    spotfirePanel.mavenData=function(data){
    	if(!arguments.length) return mavenData;
    	mavenData = data;
    	return this;
    };
    spotfirePanel.trellisGroups = function(groups){
    	if(!arguments.length) return trellisGroups;
    	trellisGroups = [...groups];
    	return this;
    };

    spotfirePanel.rollupFn = function(fn){
        if(!arguments.length) return rollupFn;
        rollupFn = fn;
        return this;
    };

    spotfirePanel.sampleData=function(data){
    	if(!arguments.length) return sampleData;
    	sampleData = data;
    	return this;
    };

    spotfirePanel.dataGroups = function(groups){
    	if(!arguments.length) return dataGroups;
    	dataGroups = [...groups];
    	return this;
    };

return spotfirePanel;

})));
