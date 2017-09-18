agios.spotfirePanel = (function(){
    'use strict';
	var mavenData = new Array,
		sampleData = new Array,
		trellisGroups = new Array,
		dataGroups = new Array,
        rollupFn = (leave)=>leave;


	function exports(){
        
        var group0 = dataGroups.pop();
        var sampleDataset = agios.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData);
        var groupHierachy = agios.groupValue(sampleData,dataGroups);
        var groupFn = agios.groupFn(groupHierachy);
		var nestFn = agios.nestFn(sampleDataset);
        
        var sampleDataset0 = agios.groupBy([group0]).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData);
        var group0Hierachy = agios.groupValue(sampleData,[group0]);
        var group0Fn = agios.groupFn(group0Hierachy);
        var nest0Fn = agios.nestFn(sampleDataset0);
       

        var grouplength = groupHierachy.reduce((acc,d)=>acc*d.length,1);
        var group0length = group0Hierachy.reduce((acc,d)=>acc*d.length,1);

        var sampleMap = d3.range(grouplength).reduce((acc,d,index)=>nestFn(groupFn(d)).reduce((a,e)=>{a[e]=index;return a},acc),{})
        var sample0Map = d3.range(group0length).reduce((acc,d,index)=>nest0Fn(group0Fn(d)).reduce((a,e)=>{a[e]=index;return a},acc),{})
         
        var mavenDataset = agios.groupBy(trellisGroups).key((d)=>sampleMap[d.sample_id]).key((d)=>sample0Map[d.sample_id]).rollup(rollupFn).object(mavenData);
        console.log(mavenDataset);
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