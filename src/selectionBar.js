import d3 from 'd3';
var metaData = {
	name:'singleSelection',
	type:'single'//* multi/single
	placeHold:'please select one',
	options:[
	{name:'opt1',value:'opt1',selected:false},
	{name:'opt1',value:'opt1',selected:false},
	{name:'opt1',value:'opt1',selected:false}
	]
}

var selectionBar = function(_selection){
_selection.selectAll('*').remove();


}


export default selectionBar;