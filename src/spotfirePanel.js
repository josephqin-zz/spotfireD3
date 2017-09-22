agios.spotfirePanel = (function(){
    'use strict';
	var mavenData = new Array,
		sampleData = new Array,
		trellisGroups = new Array,
		dataGroups = new Array,
        width = 1000,
        height = 500,
        rollupFn = (leave)=>d3.mean(leave.map((d)=>d.areatop));
    //get group hierachy info for xAxis render
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

	function exports(_selection){
        

        //get sample groups 
        var sampleGroups = agios.flatenNest(agios.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData)).filter((d)=>!d.key.includes('null'));
              
        var groupMetadata = getGroupMetaData(dataGroups,sampleGroups)
              
        var sampleMap = getSampleMap(sampleGroups)
        //get mavenData 
        
        
        var sampleIds = sampleGroups.reduce((acc,d)=>[...acc,...d.values],[])
        var chartData = agios.groupBy(trellisGroups).key((d)=>sampleMap[d.sample_id]).rollup((leave)=>{return {y:rollupFn(leave),peak_id:leave.map((d)=>d.peak_id)}}).entries(mavenData.filter((d)=>sampleIds.includes(d.sample_id)))
        var mainCanvasFn = agios.canvasWin.bindData(chartData).metaData(groupMetadata).chartType('bar');
        _selection.call(mainCanvasFn);
       _selection.append('g').call(agios.groupsBar.bindData(groupMetadata));

	};
    
    exports.mavenData=function(data){
    	if(!arguments.length) return mavenData;
    	mavenData = data;
    	return this;
    }
    exports.trellisGroups = function(groups){
    	if(!arguments.length) return trellisGroups;
    	trellisGroups = [...groups];
    	return this;
    }

    exports.rollupFn = function(fn){
        if(!arguments.length) return rollupFn;
        rollupFn = fn;
        return this;
    }

    exports.sampleData=function(data){
    	if(!arguments.length) return sampleData;
    	sampleData = data;
    	return this;
    }

    exports.dataGroups = function(groups){
    	if(!arguments.length) return dataGroups;
    	dataGroups = [...groups];
    	return this;
    }
    
	return exports
})()