"use strict";
(function(window, document, Chartist){
  var nums = data[0].estimates.bySex;
  var chartOpts = {
    axisX : {
      showGrid: false
    },
    axisY : {
      labelInterpolationFunc: function(value){
        return value + '%';
      },
      onlyInteger: true
    },
    height: '250px',
    high: 100,
    low: 0,
    showGridBackground: true
  };
  new Chartist.Bar('#chart', nums, chartOpts);
})(window, document, Chartist);
