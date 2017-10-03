    'use strict'
    import * as d3 from "d3";

    var utility = {};


    //get Max and Min of given array;
    utility.getScale = function(vals){
            return vals.reduce( (acc,cur) => {return {max:Math.max(acc.max,+cur),min:Math.min(acc.min,+cur)} } ,{max:+vals[0],min:+vals[0]} )
        };

    //return d3.nest() by given the hierachical groups structure
    utility.groupBy = function(groups){
        let nestfn = d3.nest();
        groups.map((f)=>((d)=>d[f])).forEach((d)=>nestfn.key(d))
        return nestfn.sortKeys(d3.ascending);
    };
    //flaten NestData
    utility.flatenNest = function (data,keys=[]){
        if (Array.isArray(data)) return [{key:keys,values:data}]
        else 
            {  
               return Object.keys(data).reduce((acc,key)=>[...acc,...this.flatenNest(data[key],[...keys,key])],[])
            } 
    }
    
        
    //get unique values array of give group name list
    utility.groupValue = function(dataset,groups){
        return groups.map((d)=>dataset.map((s)=>s[d]).filter((v,i,self)=>self.indexOf(v)===i))
    } 
    //build the d3.nest structure frame
    utility.groupTree = function(groups){
        return [...groups].reverse()
                          .reduce((acc,d)=>d.reduce((a,g)=>{a.push({key:g}); return a},[]).map((k)=>{k.values=[...acc];return k}),[])
    }
    //create group frame given gourps posibile value array 
    utility.groupFrame = function(groups){
        return groups.reduce((acc,d)=>{ 
                     let acclength = acc.length>0?d.length*acc[acc.length-1].length:d.length; 
                     acc.push(d3.range(acclength).map((i)=>d[i%d.length])); 
                     return acc; 
                    },[])
    }
    
    //get groups combination by given index
    utility.groupFn = (groups)=> (num)=>[...groups].reverse().reduce((acc,d)=>{ acc.push(d[acc[0]%(d.length)]);acc[0]=Math.floor(acc[0]/(d.length));return acc},[num]).slice(1);
    //nest dictionary get values
    utility.nestFn = (nestObj)=> (groups)=>[...groups].reverse().reduce((acc,d)=>acc[d]?acc[d]:[],nestObj)

    export default utility;
