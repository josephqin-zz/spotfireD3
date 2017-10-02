'use strict';
var d3 = require('d3');
var spotfireUI = require('./spotfireUI.js');
var utility = require('./utility.js');


var mavenData = new Array,
	sampleData = new Array,
	trellisGroups = new Array,
	dataGroups = new Array,
    width = 1000,
    height = 500,
    rollupFn = (leave)=>d3.mean(leave.map((d)=>d.areatop)),
    stdFn = (leave)=>d3.deviation(leave.map((d)=>d.areatop));
    
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

	var spotfirePanel = function(_selection){
        _selection.selectAll('*').remove();

        
        var menuBar = _selection.append('g').attr('id','menuBar');
        var plotUI = _selection.append('g').attr('id','plotUI');



        //get sample groups 
        var sampleGroups = utility.flatenNest(utility.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData)).filter((d)=>!d.key.includes('null'));
        
        var groupMetadata = getGroupMetaData(dataGroups,sampleGroups)
              
        var sampleMap = getSampleMap(sampleGroups)
        //get mavenData 
        
        
        var sampleIds = sampleGroups.reduce((acc,d)=>[...acc,...d.values],[])
        var chartData = utility.groupBy(trellisGroups).key((d)=>sampleMap[d.sample_id]).rollup((leave)=>{return {y:rollupFn(leave),std:stdFn(leave),peak_id:leave.map((d)=>d.peak_id)}}).entries(mavenData.filter((d)=>sampleIds.includes(d.sample_id)))
        
        var uiFn = spotfireUI.bindData(chartData).metaData(groupMetadata);
        plotUI.call(uiFn);
       

	};

    //setter and getter
    spotfirePanel.mavenData=function(data){
    	if(!arguments.length) return mavenData;
    	mavenData = data;
    	return this;
    }
    spotfirePanel.trellisGroups = function(groups){
    	if(!arguments.length) return trellisGroups;
    	trellisGroups = [...groups];
    	return this;
    }

    spotfirePanel.rollupFn = function(fn){
        if(!arguments.length) return rollupFn;
        rollupFn = fn;
        return this;
    }

    spotfirePanel.sampleData=function(data){
    	if(!arguments.length) return sampleData;
    	sampleData = data;
    	return this;
    }

    spotfirePanel.dataGroups = function(groups){
    	if(!arguments.length) return dataGroups;
    	dataGroups = [...groups];
    	return this;
    }

module.exports = spotfirePanel
