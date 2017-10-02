  'use strict'; 
  var d3 = require('d3');

  var getEvent = () => require("d3").event;
  var controlBarFn = require('./controlBar.js'),
      groupsBarFn = require('./groupsBar.js'),
      legendBarFn = require('./legendBar.js'),
      plotCanvasFn = require('./plotCanvas.js');

  var dataSet = new Array,
      metaData = new Array,
      state = {curIndex:0,chartType:'bar',std:false},
      width = 800,
      height = 270,
      cellHeight = 20,
      grinds = {row:2,col:1},
      dataLength = 0;

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
  var leftBar = _selection.append('g').attr('id','leftBar')
  var legendBar = _selection.append('g').attr('id','legendBar').attr('transform',d3.zoomIdentity.translate(30,0));;
  var mainCanvas = _selection.append('g').attr('id','mainCanvas').attr('transform',d3.zoomIdentity.translate(30,cellHeight));
  var groupBar = _selection.append('g').attr('id','groupBar').attr('transform',d3.zoomIdentity.translate(30,height+cellHeight));	
  var lineView = _selection.append('g').attr('id','lineView').attr('transform',d3.zoomIdentity.translate(width+40+30,cellHeight));


  var controlData = (state)=>[{name:'bar',type:'bar',color:'#F9D5D3',selected:false},
  {name:'stack',type:'stackbar',color:'#ECA4A6',selected:false},
  {name:'pie',type:'grouppie',color:'#807F89',selected:false},
  {name:'line',type:'stackline',color:'#99A89E',selected:false},
  {name:'std',type:'std',color:'#BBC7BA',selected:false}].map((b)=>{
    let item = {}
    Object.assign(item,b)
    if (b.type === state.chartType) item.selected=true;
    if (state.std && b.type==='std') item.selected=true;
    return item;
  })


    //update UI
    dispatcher.on('updateUI',function(newState){

       //metaData = [root-group,first-group,...,lowest-group]
       //dupicate RowData to chartData 
       let chartData = {}
       Object.assign(chartData,dataSet[newState.curIndex]);
       

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
       if(newState.chartType.indexOf('pie')!==-1) xGroup = [...metaData[metaData.length-3].values];

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
        
        if(newState.chartType==='stackbar'){
          chartData.values = xGroup.reduce((acc,g,i)=>{
            let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)) 
            let sum = rows.reduce((acc,t)=>{ t.prevous = acc ; return t.value.y+acc;},0)
            rows.forEach((v)=>{
              v.type='stack';
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

          yScale.domain([0,d3.max(chartData.values.map((t)=>typeof t.value.std==='undefined'?t.value.y:t.value.std+t.value.y))])
          yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);
          chartData.values.forEach((d,i)=>{
            d.x = newMap[d.key].x1;
            d.width = newMap[d.key].x2-newMap[d.key].x1;
            d.y = yScale(d.value.y);
            d.height = height-25-yScale(d.value.y);
            d.path = drawRect(0,0,d.width,d.height)
            d.color = color(xcMap[d.key]);
            d.type='bar';
          })
          if(newState.std){
            var stdCircle = chartData.values.filter((d)=>typeof d.value.std!=='undefined').map((d)=>{

              let stdHeight = height-25-yScale(d.value.std)
              let item = {};
              item.value = d.value;
              item.type='line';
              item.color='#929293';
              item.x=d.x+d.width/2
              item.y=d.y
              item.path = 'M 0 '+(0-stdHeight)+' v '+stdHeight*2 + 'M'+(0-d.width*0.5/2)+' '+(0-stdHeight)+' h '+d.width*0.5+' M'+(0-d.width*0.5/2)+' '+stdHeight+' h '+d.width*0.5;
              return item;
            });
            chartData.values = [...chartData.values,...stdCircle.filter((d)=>typeof d!=='undefined')];

          } 
        }else if(newState.chartType==='grouppie'){
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
            v.type = 'pie';
          })
          return [...acc,...rows]
        },[])


       }else{

        yScale.domain([0,d3.max(chartData.values.map((t)=>typeof t.value.std==='undefined'?t.value.y:t.value.std+t.value.y))])
        yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);
        chartData.values = xGroup.reduce((acc,g,i)=>{
          let rows = chartData.values.filter((d)=>g.values.includes(+d.key)).sort((a,b)=>+a.key-(+b.key)) 

          rows.forEach((v)=>{
            v.type='circle';

            v.x = xScale(i)+xScale.bandwidth()/2;
            v.width = xScale.bandwidth();  })
          return [...acc,...rows]

        },[]);



        chartData.values.forEach((d,i)=>{

          d.y = yScale(d.value.y);
          d.height = height-25-yScale(d.value.y);
          d.path = drawCircle(0,0,d.width*0.1/2)
          d.color = color(xcMap[d.key]);
        })
            //add line
            let linefn = d3.line().x((d)=>d.x).y((d)=>d.y)
            let lines = d3.nest().key((d)=>xcMap[d.key]).entries(chartData.values)
            let paths = lines.map((d)=>d.values).map(linefn)
            
            chartData.values = [...lines.map((l,i)=>{
              let item = {}
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

                let stdHeight = height-25-yScale(d.value.std)
                let item = {};
                item.value = d.value;
                item.type='line';
                item.color='#929293';
                item.x=d.x
                item.y=d.y
                item.path = 'M 0 '+(0-stdHeight)+' v '+stdHeight*2 + 'M'+(0-d.width*0.1/2)+' '+(0-stdHeight)+' h '+d.width*0.1+' M'+(0-d.width*0.1/2)+' '+stdHeight+' h '+d.width*0.1;
                return item;
              });
              chartData.values = [...chartData.values,...stdCircle.filter((d)=>typeof d!=='undefined')];

            }
            yAxis = d3.axisRight(yScale).ticks(5).tickFormat(d3.format(".2s")).tickSize(width);
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

     	mainCanvas.call(plotCanvasFn.bindData(chartData).yAxisFn(yAxis).clickEvent(function(d,i){dispatcher.call('chromagraphUI',this,d)}));
     	legendBar.call(legendBarFn.bindData(legendData));
     	groupBar.call(groupsBarFn.bindData(groupbarData));
      leftBar.call(controlBarFn.setHeight(height).bindData(controlData(newState)).clickEvent(function(d,i){ d.type==='std'?state.std=!state.std:state.chartType=d.type;dispatcher.call('updateUI',this,state); }))  

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

    //  _selection.on('mousewheel.zoom',function(d){
      

    //   lineView.selectAll('*').remove();
    //   let cur = state.curIndex;
    //   if(d3.event.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
    //   else cur = cur-1>=0?cur-1:0;
    //   Object.assign(state,{curIndex:cur});
    //   dispatcher.call('updateUI',this,state);
    // });

    _selection.node().parentNode.addEventListener("wheel", function(e){
      lineView.selectAll('*').remove();
      let cur = state.curIndex;
      if(e.wheelDelta<0) cur = cur+1<dataLength?cur+1:dataLength-1;
      else cur = cur-1>=0?cur-1:0;
      Object.assign(state,{curIndex:cur});
      dispatcher.call('updateUI',this,state);
    });

    //default view
    dispatcher.call('updateUI',this,state);

  }

    //getter and setter
  spotfireUI.bindData = function (data){
     if(!arguments.length) return dataSet;
     dataSet = data;
     state.curIndex=0;
     dataLength = data.length;
     return this;
   }

  spotfireUI.metaData = function (data){
     if(!arguments.length) return metaData;
     metaData = data;
     return this;
   }

  spotfireUI.chartType = function (data){
     if(!arguments.length) return state.chartType;
     state.chartType = data;
     return this;
   }


module.exports = spotfireUI;
