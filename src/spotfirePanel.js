agios.spotfirePanel = (function(){
	var mavenData = new Array,
		sampleData = new Array,
		trimGroups = ['sample_id'],
		dataGroups = [];


	function exports(){
		let mavenDataset = agios.groupBy(trimGroups).object(mavenData);
		let sampleDataset = agios.groupBy(dataGroups).rollup((leave)=>leave.map((d)=>d.sample_id)).object(sampleData);
        let groupHierachy = agios.groupValue(sampleData,dataGroups);
        let groupFn = agios.groupFn(groupHierachy);
        let nestFn = agios.nestFn(sampleDataset);
        let group0length = groupHierachy.reduce((acc,d)=>acc*d.length,1);
        let Object.keys(mavenDataset).map((grid)=>d3.range(group0length).map((index)=>nestFn(groupFn(index).map((sampleid)=>grid[sampleid]))))


	};
    
    exports mavenData=function(data){
    	if(!arguments.length) return mavenData;
    	mavenData = data;
    	return this;
    }
    exports.trimGroups = function(groups){
    	if(!arguments.length) return trimGroups;
    	trimGroups = [...groups,'smaple_id'];
    	return this;
    }

    exports sampleData=function(data){
    	if(!arguments.length) return sampleData;
    	sampleData = data;
    	return this;
    }

    exports.trimGroups = function(groups){
    	if(!arguments.length) return dataGroups;
    	dataGroups = groups;
    	return this;
    }
    
	return exports
})()