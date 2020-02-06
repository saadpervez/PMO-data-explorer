/*
 * Search for indicators and create an article with data from pmo.js
 */
(function($, window, document, Chartist, PMO){
  'use strict';
  // define the elements of interest
  const search = document.querySelector('.search-text');
  // Search the data
  function searchData(query){
    //fetch('https://cdn.jsdelivr.net/gh/DurhamRegionHARP/PMO-data-explorer@gh-pages/_data/pmo.json')
    fetch('http://127.0.0.1:4000/PMO-data-explorer/pmo.json')
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        const regex = new RegExp(query, 'i');
        const found = data.indicators.filter(function(elem){
          if (regex.test(elem.pmoName) || regex.test(elem.description) || regex.test(elem.tags.join(' '))){
            return elem;
          };
        });
        handleSearchResult(found);
        if(!found.length && document.querySelector('.indicator-list').hasChildNodes()){
          resetList();
        }
        found.forEach(function(el){
          buildArticleNode(query, el);
        });           
      })
      .catch(function(error){
        console.log(error);
      });
  }
  // Handle the result
  // TODO:
  //  - Google analytics log this query -> query = search.value.trim()
  function handleSearchResult(data){
    const amount = data.length;
    const message = document.createElement('p');
    let messageHtml = amount + ' result' + ( amount === 1 ? '' : 's') + ' found';
    if (amount === 0){
      messageHtml += '<p>Why not <a href="#">suggest</a> this topic be added?</p>';
    }
    message.insertAdjacentHTML('afterbegin', messageHtml);
    // Check whether a "search-feedback" element exists
    const messageSpan = document.querySelector('.search-feedback');
    if(messageSpan){
      // We've got a message on screen already
      // remove the former and add the current
      messageSpan.removeChild(messageSpan.firstChild);
      messageSpan.appendChild(message);
      search.parentNode.appendChild(messageSpan);
    }
    else{
      // "search-feedback" element does not exist
      // Create it
      const messageContainer = document.createElement('span');
      messageContainer.setAttribute('class', 'search-feedback');
      messageContainer.appendChild(message);
      search.parentNode.appendChild(messageContainer);
    }
  }
  // Reset the search
  function resetSearch(){
    const messageElem = document.querySelector('.search-feedback');
    if(messageElem){
      search.parentNode.removeChild(messageElem);
    }
  }
  // Reset the indicator block
  function resetList(){
    const list = document.querySelector('.indicator-list');
    while(list.firstChild){
      list.removeChild(list.firstChild);
    }
  }
  // Build the article
  function buildArticleNode(query, indicator){
    const articles = document.querySelectorAll('.indicator-block');
    const regex = new RegExp(query, 'i');
    // Filter out indicators on screen that do not match the current query string
    // Switch to for loop
    for(let i = 0; i < articles.length; i++){
      if(!regex.test(articles[i].className)){
        articles[i].parentNode.removeChild(articles[i]);
      }
    };
    // Only build if an indicator block does not exist
    const _indicator = new PMO(indicator);
    if (!document.querySelector('.indicator-' + _indicator.slug)){
      _indicator.create();
      _indicator.chartsToBuild.forEach(function(chart){
        buildArticleCharts(`#${_indicator.slug}-${chart}`, _indicator.chartData[chart]);
      });
    }
  }
  function buildArticleCharts(chartName, data){
    const upper = data['series'].map(function(el){
      return el['cl'].map(function(el){
        return el[0];
      });
    });
    const lower = data['series'].map(function(el){
      return el['cl'].map(function(el){
        return el[1];
      });
    });
    const notes = data['series'].map(function(el){
      return el['notes'];
    });
    const chartOpts = {
      axisX : {
        showGrid: false
      },
      axisY : {
        labelInterpolationFnc: function(value){
          return value + '%';
        },
        onlyInteger: true
      },
      height: '250px',
      width: '1100px',
      high: 100,
      low: 0,
      showGridBackground: true,
      seriesBarDistance: 22,
      plugins: [
        Chartist.plugins.errorBars({
          orientation: 'vertical',
          confidenceLimit: {
            upper: upper,
            lower: lower
          }
        }),
        Chartist.plugins.tooltip({
          appendToBody: true,
          tooltipFnc: function(meta, value){
            let metaText = (meta == "null") ? "" : `<br>${meta}`;
            return `${value}%${metaText}`;
          }
        }),
        Chartist.plugins.legend({
          className: "list-inline"
        })
      ]
    };
    const responsiveOpts = [
      ['screen and (max-width: 767px)', {
        horizontalBars: true,
        width: '650px',
        seriesBarDistance: 15,
        chartPadding: {
          right: 25
        },
        axisX: {
          labelInterpolationFnc: function(value){
            return value + '%';
          },
          onlyInteger: true,
          showGrid: true           
        },
        axisY: {
          labelInterpolationFnc: Chartist.noop,
          showGrid: false
        }
      }],
      ['screen and (min-width: 768px)', {
        width: '680px',
        seriesBarDistance: 22,
      }],
      ['screen and (min-width: 992px)', {
        seriesBarDistance: 22,
        width: '900px',
      }],
      ['screen and (min-width: 1200px)', {
        seriesBarDistance: 22,
        width: '1100px',
      }],
    ];
    let chart = new Chartist.Bar(chartName, data, chartOpts, responsiveOpts);
    chart.on('draw', function(component){
      if (component.type === 'bar'){
        component.element.attr({ "ct:meta": this[component.seriesIndex][component.index] });
      }
    }.bind(notes));
    $(".wb-toggle").trigger("wb-init.wb-toggle");
    $(".wb-tabs").trigger("wb-init.wb-tabs");
  }
  document.addEventListener('DOMContentLoaded', function(){
    search.addEventListener('input', function(e){
      if(typeof this.toId === 'number'){
        clearTimeout(this.toId);
        this.toId = undefined;
      }
      this.toId = setTimeout(function(evt){
        let currentQuery = evt.target.value;
        if(!currentQuery.length){
          resetSearch();
          return;
        }  
        searchData(currentQuery);
      }.bind(this), 600, e);
    });
  });
})($, window, document, Chartist, PMO);
