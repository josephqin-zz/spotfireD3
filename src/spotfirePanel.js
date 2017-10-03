'use strict';
import d3 from 'd3';
import {default as spotfireUI} from './spotfireUI.js';
import {default as utility} from './utility.js';
import {default as selectionBar} from './selectionBar.js';


var mavenData = new Array,
	sampleData = new Array,
    trellisOpts=['compound','group_id'],
    yValueOpts=['area','areatop'],
    groupsOpts=['reagent','stime', 'complex', 'dosage','cell_origin', 'cell_name', 'drug_sensitivity'],
    width = 1000,
    height = 500;
   
    
    //get group hierachy info
    var getGroupMetaData = (groupList,sampleGroups) => groupList.map((g,i)=>{return {
            key:g,
            values:sampleGroups.map((t)=>t.key.filter((k,index)=>index<=i))
                               .reduce((acc,sg,j,self)=>{
                                (j>0 && self[j-1].toString()===sg.toString())?acc[acc.length-1].values.push(j):acc.push({key:sg[sg.length-1],values:[j]});
                                return acc;},
                                [])
            } 
        })
    
    //get sampeMap index is the unique group and name will keep the name to identify which level of the groups to determine the color.
    var getSampleMap = (sampleGroups) => sampleGroups.reduce((acc,d,i)=>d.values.reduce((a,v)=>{ a[v]=i;return a },acc),{})
    var optionsGenerator = (opts,d) => opts.map((o,i)=>{
        let item = {};
        item.name = o;
        item.value = o;
        if(d<=1){
            item.selected = i<d?0:-1;
        }else{
            item.selected = i<d?i+1:-1;
        }
        

        return item;
    })
	var spotfirePanel = function(_selection){
        _selection.selectAll('*').remove();

        var menuBarData = [{
            name:'trellis By',
            type:'single',//* multi/single
            stopBy:false,
            options:optionsGenerator(trellisOpts,1)},
            {name:'y value',
            type:'single',//* multi/single
            stopBy:false,
            options:optionsGenerator(yValueOpts,1)},
            {name:'groups By',
            type:'multi',//* multi/single
            stopBy:false,
            options:optionsGenerator(groupsOpts,3)}];

     
        var dispatcher = d3.dispatch('updateUI')
        dispatcher.on('updateUI',function(newData){
            
            let trellisGroups = newData[0].options.filter((d)=>d.selected>-1).map((d)=>d.value)
            let yValue = newData[1].options.filter((d)=>d.selected>-1).map((d)=>d.value)[0]
            let dataGroups = newData[2].options.filter((d)=>d.selected>-1).sort((a,b)=>a.selected-b.selected).map((d)=>d.value)
            if(d3.min(newData.map((d)=>d.options.filter((d)=>d.selected>-1).length))===0) return;
            // console.log(newData.map((d)=>d.options.filter((d)=>d.selected>-1).length))
            //get sample groups 
            let  rollupFn = (leave)=>d3.mean(leave.map((d)=>d[yValue])),
                 stdFn = (leave)=>d3.deviation(leave.map((d)=>d[yValue]));

            let sampleGroups = utility.flatenNest(utility.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData)).filter((d)=>!d.key.includes('null'));
            
            let groupMetadata = getGroupMetaData(dataGroups,sampleGroups);
                  
            let sampleMap = getSampleMap(sampleGroups);
            //get mavenData 
            
            
            let sampleIds = sampleGroups.reduce((acc,d)=>[...acc,...d.values],[])
            let chartData = utility.groupBy(trellisGroups).key((d)=>sampleMap[d.sample_id]).rollup((leave)=>{return {y:rollupFn(leave),std:stdFn(leave),peak_id:leave.map((d)=>d.peak_id)}}).entries(mavenData.filter((d)=>sampleIds.includes(d.sample_id)))
            
            let uiFn = spotfireUI.bindData(chartData).metaData(groupMetadata);
            plotUI.call(uiFn);


        })

        var plotUI = _selection.append('g').attr('id','plotUI').attr('transform',d3.zoomIdentity.translate(0,25));
        var menuBar = _selection.append('g').attr('id','menuBar').attr('transform',d3.zoomIdentity.translate(30,0));
        menuBar.call(selectionBar.bindData(menuBarData));
        var updateButton = _selection.append('g').attr('id','updateButton').attr('transform',d3.zoomIdentity.translate(800-150,2.5))
        
        updateButton.append('rect').attr('fill','#2E86C1')
                                    .style('opacity',0.8)
                                    .attr('width',150)
                                    .attr('height',20)


        updateButton.append('text').text('update').style('font-size','1em')
                                   .attr('x',150/2)
                                   .attr('y',20/2)
                                   .style('dominant-baseline','middle')
                                   .style('text-anchor','middle')
        
        updateButton.on('click',function(){
            dispatcher.call('updateUI',this,menuBarData);
        })

        dispatcher.call('updateUI',this,menuBarData);
        
        
       

	};

    //setter and getter
    spotfirePanel.mavenData=function(data){
    	if(!arguments.length) return mavenData;
    	mavenData = data;
    	return this;
    }
    spotfirePanel.trellisOpts = function(groups){
    	if(!arguments.length) return trellisOpts;
    	trellisOpts = [...groups];
    	return this;
    }

    spotfirePanel.yValueOpts = function(groups){
        if(!arguments.length) return yValueOpts;
        yValueOpts = [...groups];
        return this;
    }

    spotfirePanel.sampleData=function(data){
    	if(!arguments.length) return sampleData;
    	sampleData = data;
    	return this;
    }

    spotfirePanel.groupsOpts = function(groups){
    	if(!arguments.length) return groupsOpts;
    	groupsOpts= [...groups];
    	return this;
    }

export default spotfirePanel;
