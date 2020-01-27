var pmo = (function(){
  var returnData = function(){
    return [
    {  
      "pmoID":1,
      "pmoName":"Cannabis Use",
      "description":"How often cannabis was used in the last year",
      "tags": ['Blaze','blunt','bong','cannabanoids','cannabis','cannabis brownies','cannabis candy','cannabis cookies','cannabis drink','cannabis food','cannabis tea','dabbing','grass','hash','hashish','joint','marijuana','pot','smoking','weed' ],
      "estimates": {
        "byAll": {
            "labels": [ 'Did not use','Once or twice','Three or more times' ],
            "series": [ { "name": "Durham Region", "data": [80,6,15], "cl": [[85,74],[8,3],[20,9]],"notes": [null,'Interpret with caution as the estimate has high sampling variability','Interpret with caution as the estimate has high sampling variability'] },{ "name": "Ontario", "data": [81,6,13], "cl": [[83,79],[6,5],[15,12]],"notes": [null,null,null] } ]
        },
        "bySex": {
            "labels": [ 'Did not use','Once or twice','Three or more times' ],
            "series": [ { "name": "Durham Region Male", "data": [76,5,19], "cl": [[85,67],[7,3],[28,10]],"notes": [null,'Interpret with caution as the estimate has high sampling variability','Interpret with caution as the estimate has high sampling variability'] },{ "name": "Durham Region Female", "data": [83,7,10], "cl": [[88,78],[10,3],[14,6]],"notes": [null,'Interpret with caution as the estimate has high sampling variability','Interpret with caution as the estimate has high sampling variability'] },{ "name": "Ontario Male", "data": [80,5,15], "cl": [[83,78],[6,4],[17,13]],"notes": [null,null,null] },{ "name": "Ontario Female", "data": [82,7,12], "cl": [[84,79],[8,6],[13,10]],"notes": [null,null,null] } ]
        },
        "byGrade": {
            "labels": [ 'Did not use','Once or twice','Three or more times' ],
            "series": [ { "name": "Durham Region Grades 7 and 8", "data": [98,null,null], "cl": [[100,97],[null,null],[null,null]],"notes": [null,'Unreliable and not releasable','Unreliable and not releasable'] },{ "name": "Durham Region Grades 9 to 12", "data": [72,8,20], "cl": [[79,65],[11,5],[27,13]],"notes": [null,'Interpret with caution as the estimate has high sampling variability','Interpret with caution as the estimate has high sampling variability'] },{ "name": "Ontario Grades 7 and 8", "data": [98,1,1], "cl": [[99,97],[2,1],[1,0]],"notes": [null,'Interpret with caution as the estimate has high sampling variability','Interpret with caution as the estimate has high sampling variability'] },{ "name": "Ontario Grades 9 to 12", "data": [75,8,18], "cl": [[77,72],[8,7],[20,16]],"notes": [null,null,null] } ],
        }
      }
    }
    ]
  }
  return {
    getData: returnData
  };
})();
