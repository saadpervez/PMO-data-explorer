/**
* Chartist.js plugin to display an error bar at each data point or bar.
*
*/
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';
  
	var defaultOptions = {
    errorClass: 'ct-error',
    orientation: 'horizontal',
		confidenceLimit: {
			upper: [],
			lower: []
		}
  };
  var lineLengthCalculation = {
      point: function(data, options){
        return {
          x1: data.hasOwnProperty('x1') ? [data.x1] : [data.x],
          x2: data.hasOwnProperty('x2') ? [data.x2] : [data.x],
          y1: [ data.axisY.chartRect.y1 - Chartist.projectLength( data.axisY.axisLength, options.confidenceLimit.lower[data.seriesIndex][data.index], data.axisY.bounds ) ],
          y2: [ data.axisY.chartRect.y1 - Chartist.projectLength( data.axisY.axisLength, options.confidenceLimit.upper[data.seriesIndex][data.index], data.axisY.bounds ) ]
        };
      },
      bar: {
        vertical: function(data, options){
          return {
            x1: data.hasOwnProperty('x1') ? [data.x1] : [data.x],
            x2: data.hasOwnProperty('x2') ? [data.x2] : [data.x],
            y1: [ data.axisY.chartRect.y1 - Chartist.projectLength( data.axisY.axisLength, options.confidenceLimit.lower[data.seriesIndex][data.index], data.axisY.bounds ) ],
            y2: [ data.axisY.chartRect.y1 - Chartist.projectLength( data.axisY.axisLength, options.confidenceLimit.upper[data.seriesIndex][data.index], data.axisY.bounds ) ]
          };
        },
        horizontal: function(data, options){
          return {
            x1: [ data.axisX.chartRect.x1 + Chartist.projectLength( data.axisX.axisLength, options.confidenceLimit.lower[data.seriesIndex][data.index], data.axisX.bounds ) ],
            x2: [ data.axisX.chartRect.x1 + Chartist.projectLength( data.axisX.axisLength, options.confidenceLimit.upper[data.seriesIndex][data.index], data.axisX.bounds ) ],
            y1: data.hasOwnProperty('y1') ? [data.y1] : [data.y],
            y2: data.hasOwnProperty('y2') ? [data.y2] : [data.y]
          };
        }
      }
    };

  Chartist.plugins = Chartist.plugins || {};
  Chartist.plugins.errorBars = function (options) { 
    options = Chartist.extend({}, defaultOptions, options);

    function addErrorBar(lineLength, data){
      var errBar = new Chartist.Svg('line', lineLength, options.errorClass);
      data.element.parent().append(errBar);
    }	  
    
    return function errorBars(chart){
      if( chart instanceof Chartist.Bar || chart instanceof Chartist.Line ){
        chart.on('draw', function(data) {
          var lengthCalculator = lineLengthCalculation[data.type] && lineLengthCalculation[data.type][options.orientation] || lineLengthCalculation[data.type];
          if(lengthCalculator){
            addErrorBar( lengthCalculator(data, options), data );
          }
        });
      }
    }
  };
} (window, document, Chartist));
