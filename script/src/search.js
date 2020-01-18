/*
 * Search for indicators and create an article with data from pmo.js
 */
(function($, window, document, data, Chartist){
  // define the elements of interest
  var list = document.querySelector('.indicator-list'),
      search = document.querySelector('.search-text'),
      messageElem = document.createElement('div');


  // Search the data
  function searchData(query){
    var regex = new RegExp(query, 'i');
    var found = data.filter(function(elem){
      if (regex.test(elem.pmoName) || regex.test(elem.description)){
        return elem;
      };
    });
    handleSearchResult(found);
    return found;
  }
  
  // Handle the result
  function handleSearchResult(data){
    var amount = data.length,
    // Google analytics log this query -> query = search.value.trim()
    message = '<p>' + amount + ' result' + ( amount === 1 ? '' : 's') + ' found</p>';
    if (amount === 0){
      message += '<p>Why not <a href="#">suggest</a> this topic be added?</p>';
    }
    messageElem.innerHTML = message;
    search.parentNode.appendChild(messageElem);
  }

  // Reset the search
  function resetSearch(){
    search.parentNode.removeChild(messageElem);
  }
  // Initialize the search

  // Build the article
  function buildArticleNode(){
    var article = document.createElement('article');
    article.setAttribute('class', 'indicator-block');
    list.appendChild(article);
  }
  function buildArticleLink(indicator, id){
    var block = document.querySelectorAll('.indicator-block');
    var link = document.createElement('a');
    var text = document.createTextNode('#');
    link.setAttribute('class','indicator-permalink');
    link.setAttribute('href', '#' + indicator.pmoName.split(' ').join('-').toLowerCase());
    link.setAttribute('title', 'Link to just this indicator');
    link.appendChild(text);
    block[id].appendChild(link);
  }
  function buildArticleHeader(indicator, id){
    var block = document.querySelectorAll('.indicator-block'),
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
    descText = document.createTextNode(indicator.description)
    buttons = [ genderBtn, gradeBtn, allBtn ];
    btnText = [ genderBtnText, gradeBtnText, allBtnText ];

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
      el.setAttribute('class', 'btn btn-default wb-toggle');
      el.setAttribute('data-toggle', '{ "selector": "#chart"}')
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
    block[id].appendChild(headContainer);
    block[id].appendChild(ctrlDiv);
  }
  function buildArticleCharts(indicator, id){
    var block = document.querySelectorAll('.indicator-block');
    var chartContainer = document.createElement('div');
    chartContainer.setAttribute('class', 'indicator-chart');
    var chartSex = document.createElement('div');
    chartSex.setAttribute('id', 'chart-sex');
    var chartGrade = document.createElement('div');
    chartGrade.setAttribute('id', 'chart-grade');
    var chartAll = document.createElement('div');
    chartAll.setAttribute('id', 'chart-all');
    var charts = [ chartGrade, chartSex, chartAll ];
    charts.forEach(function(el){
      chartContainer.appendChild(el);
    })
    block[id].appendChild(chartContainer);
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
      showGridBackground: true,
      seriesBarDistance: 22
    };
    new Chartist.Bar('#chart-grade', indicator.estimates.bySex, chartOpts);  
  }
  // Note tabs <-- need to be initalized with WET
  function buildArticleNotes(indicator, id){
    var block = document.querySelectorAll('.indicator-block');
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
      var tabElement = document.createElement('summary');
      var tabName = document.createTextNode("Notes");
      tabElement.appendChild(tabName);
      var sum = document.createElement('p');
      var sumText = document.createTextNode('The note text goes here.');
      sum.appendChild(sumText);
      el.setAttribute('class', 'tab' + idx);
      el.appendChild(tabElement);
      el.appendChild(sum);
      panelDiv.appendChild(el)
    });
    tabsDiv.appendChild(panelDiv);
    noteDiv.appendChild(tabsDiv);
    block[id].appendChild(noteDiv);
    $(".wb-tabs").trigger("wb-init.wb-tabs");
  }
  search.addEventListener('input', function(){
    var currentQuery = this.value;
    if(!currentQuery.length){
      resetSearch();
      return;
    }
    else{
      setTimeout(function(){
      // Do things when something is searched
      var results = searchData(currentQuery);
      results.forEach(function(elem, idx){
        buildArticleNode();
        buildArticleLink(elem, idx);
        buildArticleHeader(elem,idx);
        buildArticleCharts(elem, idx);
        buildArticleNotes(elem, idx);
      });        
     }, 500);
    }
  });
})($, window, document, data, Chartist);
