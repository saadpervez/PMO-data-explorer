/*
 * Search for indicators and create an article with data from pmo.js
 */
(function($, window, document, Chartist){
  // define the elements of interest
  var list = document.querySelector('.indicator-list'),
      search = document.querySelector('.search-text');

  // Search the data
  function searchData(query){
    fetch('https://cdn.jsdelivr.net/gh/durhamregionharp/pmo-data-explorer@xhr-get-data/_data/pmo.json')
      .then(function(response){
        return response.json();
      })
      .then(function(jsonText){
        console.log(jsonText);
        var data = JSON.parse(jsonText);
        var regex = new RegExp(query, 'i');
        var found = data.indicators.filter(function(elem){
          if (regex.test(elem.pmoName) || regex.test(elem.description) || regex.test(elem.tags.join(' '))){
            return elem;
          };
        });
        handleSearchResult(found);
        return found;
      })
      .catch(function(error){
        console.log(error);
      });
  }
  // Handle the result
  // TODO:
  //  - Google analytics log this query -> query = search.value.trim()
  function handleSearchResult(data){
    var amount = data.length,
    message = document.createElement('p'),
    messageHtml = amount + ' result' + ( amount === 1 ? '' : 's') + ' found';
    if (amount === 0){
      messageHtml += '<p>Why not <a href="#">suggest</a> this topic be added?</p>';
    }
    message.insertAdjacentHTML('afterbegin', messageHtml);
    // Check whether a "search-feedback" element exists
    var messageSpan = document.querySelector('.search-feedback');
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
      var messageContainer = document.createElement('span');
      messageContainer.setAttribute('class', 'search-feedback');
      messageContainer.appendChild(message);
      search.parentNode.appendChild(messageContainer);
    }
  }
  // Reset the search
  function resetSearch(){
    messageElem = document.querySelector('.search-feedback');
    if(messageElem){
      search.parentNode.removeChild(messageElem);
    }
  }
  // Reset the indicator block
  function resetList(){
    while(list.firstChild){
      list.removeChild(list.firstChild);
    }
  }
  // Build the article
  function buildArticleNode(query, indicator){
    var articles = document.querySelectorAll('.indicator-block'),
      slug = indicator.pmoName.split(' ').join('-').toLowerCase(),
      regex = new RegExp(query, 'i');
    // Filter out indicators on screen that do not match the current query string
    // Switch to for loop
    for(var i = 0; i < articles.length; i++){
      if(!regex.test(articles[i].className)){
        articles[i].parentNode.removeChild(articles[i]);
      }
    };
    // Only build if an indicator block does not exist
    if (!document.querySelector('.indicator-' + slug)){
      var article = document.createElement('article');
      article.setAttribute('class', 'indicator-block indicator-' + slug);
      list.appendChild(article);
      buildArticleLink(indicator);        
    }
  }
  function buildArticleLink(indicator){
    var slug = indicator.pmoName.split(' ').join('-').toLowerCase();
    var block = document.querySelector('.indicator-' + slug);
    var link = document.createElement('a');
    var text = document.createTextNode('#');
    link.setAttribute('class','indicator-permalink');
    link.setAttribute('href', '#' + indicator.pmoName.split(' ').join('-').toLowerCase());
    link.setAttribute('title', 'Link to just this indicator');
    link.appendChild(text);
    block.appendChild(link);
    buildArticleHeader(indicator);
  }
  function buildArticleHeader(indicator){
    var slug = indicator.pmoName.split(' ').join('-').toLowerCase();
    var block = document.querySelector('.indicator-' + slug),
    headContainer = document.createElement('div'),
    header = document.createElement('h3'),
    desc = document.createElement('p'),
    ctrlDiv = document.createElement('div'),
    btnDiv = document.createElement('div'),
    genderBtn = document.createElement('button'),
    genderBtnText = document.createTextNode('Sex relative'),
    gradeBtn = document.createElement('button'),
    gradeBtnText = document.createTextNode('Grade relative'),
    allBtn = document.createElement('button'),
    allBtnText = document.createTextNode('All responses'),
    optionsHint = document.createElement('a'),
    optionsHintText = document.createTextNode('?'),
    headerText = document.createTextNode(indicator.pmoName),
    descText = document.createTextNode(indicator.description),
    buttons = [ gradeBtn, genderBtn, allBtn ],
    btnText = [ gradeBtnText, genderBtnText, allBtnText ];

    headContainer.setAttribute('class', 'indicator-header');
    header.setAttribute('class', 'indicator-title');
    header.appendChild(headerText);
    desc.setAttribute('class', 'indicator-desc');
    desc.appendChild(descText);
    headContainer.appendChild(header);
    headContainer.appendChild(desc);
    // Buttons
    ctrlDiv.setAttribute('class', 'view-control');
    btnDiv.setAttribute('class', 'view-mode-control btn-group-sm btn-group');
    buttons.forEach(function(el, idx){
      var chartIds = [ 'byGrade', 'bySex', 'byAll' ];
      el.setAttribute('class', 'btn btn-default wb-toggle');
      el.setAttribute('data-toggle', '{ "selector": "#' + slug + '-' + chartIds[idx] + '","group": ".chart","type": "on"}')
      el.appendChild(btnText[idx]);
      btnDiv.appendChild(el);
    });
    // Help button
    optionsHint.setAttribute('class', 'btn btn-sm btn-default overlay-lnk');
    optionsHint.setAttribute('href', '#options-hint');
    optionsHint.setAttribute('aria-controls', 'options-hint');
    optionsHint.setAttribute('role', 'button');
    optionsHint.appendChild(optionsHintText);
    ctrlDiv.appendChild(btnDiv);
    ctrlDiv.appendChild(optionsHint)
    block.appendChild(headContainer);
    block.appendChild(ctrlDiv);
    buildArticleCharts(indicator);
  }
  function buildArticleCharts(indicator){
    var slug = indicator.pmoName.split(' ').join('-').toLowerCase();
    var block = document.querySelector('.indicator-' + slug);
    var chartContainer = document.createElement('div');
    chartContainer.setAttribute('class', 'indicator-chart');
    var chartSex = document.createElement('div');
    chartSex.setAttribute('id', slug + '-bySex');
    var chartGrade = document.createElement('div');
    chartGrade.setAttribute('id', slug + '-byGrade');
    var chartAll = document.createElement('div');
    chartAll.setAttribute('id', slug + '-byAll');
    var charts = [ chartGrade, chartSex, chartAll ];
    charts.forEach(function(el){
      el.setAttribute('class', 'chart');
      chartContainer.appendChild(el);
    });
    block.appendChild(chartContainer);
    charts.forEach(function(el, idx){
      if(idx === 0){
        el.className += ' on';
      }
      // Chartist.js
      var dataObj = indicator.estimates[el.id.substr(slug.length + 1)]
      var upper = dataObj['series'].map(function(el){
        return el['cl'].map(function(el){
          return el[0];
        });
      });
      var lower = dataObj['series'].map(function(el){
        return el['cl'].map(function(el){
          return el[1];
        });
      });
      var chartOpts = {
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
          })
        ]
      };
      var responsiveOpts = [
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
      new Chartist.Bar('#' + el.id, dataObj, chartOpts, responsiveOpts);
    });
    $(".wb-toggle").trigger("wb-init.wb-toggle");
    buildArticleNotes(indicator);
  }
  function buildArticleNotes(indicator){
    var slug = indicator.pmoName.split(' ').join('-').toLowerCase();
    var block = document.querySelector('.indicator-' + slug);
    var noteDiv = document.createElement('div');
    noteDiv.setAttribute('class', 'indicator-footer');
    var tabsDiv = document.createElement('div');
    tabsDiv.setAttribute('class', 'wb-tabs');
    var panelDiv = document.createElement('div');
    panelDiv.setAttribute('class', 'tabpanels');
    var tab1 = document.createElement('details');
    var tab2 = document.createElement('details');
    var tab3 = document.createElement('details');
    var tabs = [ tab1, tab2, tab3 ];
    tabs.forEach(function(el, idx){
      var tabNames = ['Notes', 'Source', 'Feedback'];
      el.setAttribute('class', 'tab' + idx);
      var tabElement = document.createElement('summary');
      tabElement.insertAdjacentText('afterbegin', tabNames[idx]);
      el.appendChild(tabElement);
      panelDiv.appendChild(el);
    });
    // Add this to the data
    tab1.insertAdjacentHTML('beforeend', '<p>Results are weighted by sex and grade to the 2017 Ontario student population</p>');
    tab2.insertAdjacentHTML('beforeend', '<p>2018-2019 Ontario Student Drug Use and Health Survey.</p>');
    tab3.insertAdjacentHTML('beforeend', '<p>Your comments are welcome through our feedback form</p>');
    tabsDiv.appendChild(panelDiv);
    noteDiv.appendChild(tabsDiv);
    block.appendChild(noteDiv);
    $(".wb-tabs").trigger("wb-init.wb-tabs");
  }
  search.addEventListener('input', function(e){
    if(typeof this.toId === 'number'){
      clearTimeout(this.toId);
      this.toId = undefined;
    }
    this.toId = setTimeout(function(evt){
      var currentQuery = evt.target.value;
      if(!currentQuery.length){
        resetSearch();
        return;
      }  
      var results = searchData(currentQuery);
      if(!results.length && list.hasChildNodes()){
        resetList();
      }
      results.forEach(function(el){
        buildArticleNode(currentQuery, el);
      });
    }.bind(this), 600, e);
  });
})($, window, document, Chartist);
