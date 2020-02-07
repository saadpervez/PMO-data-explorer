(function(window, document){
// PMO indicator instance
let PMO = function(data){
  this.version = "0.0.1";
  this.anchor = document.querySelector('.indicator-list');
  this.name = data.pmoName;
  this.description = data.description;
  this.slug = data.pmoName.split(' ').join('-').toLowerCase();
  this.chartData = data.estimates;
  this.chartsToBuild = Object.keys(data.estimates);
  this.container = function(){
    const article = document.createElement('article');
    article.setAttribute('class', `indicator-block indicator-${this.slug}`);
    return article;
  };
  this.notes = {
    Notes: [
      'Source: 2018-2019 Ontario Student Drug Use and Health Survey',
      'Missing bars indicate an estimate is unreliable and not releaseable'
    ],
    Feedback: 'Your comments are welcome through our <a href="#">feedback form</a>'
  };
  // Build functions
  // Get all the Elements ready but do not print to the DOM
  this.buildLink = function(){
    const link = document.createElement('a');
    link.insertAdjacentText('afterbegin', '#');
    link.setAttribute('class','indicator-permalink');
    link.setAttribute('href', `#${this.slug}`);
    link.setAttribute('title', 'Link to just this indicator');
    return link;
  }
  this.buildHeader = function(){
    const self = this;
    const headContainer = document.createElement('div');
    const header = document.createElement('h3');
    const desc = document.createElement('p');
    headContainer.setAttribute('class', 'indicator-header');
    header.setAttribute('class', 'indicator-title');
    desc.setAttribute('class', 'indicator-desc');
    desc.insertAdjacentText('afterbegin', this.description);
    header.insertAdjacentText('afterbegin', this.name);
    headContainer.appendChild(header);
    headContainer.appendChild(desc);
    // Buttons
    const allBtn = document.createElement('button');
    const gradeBtn = document.createElement('button');
    const genderBtn = document.createElement('button');
    const buttons = [ allBtn, gradeBtn, genderBtn ];
    const buttonDiv = document.createElement('div');
    const ctrlDiv = document.createElement('div');
    const optionsHint = document.createElement('a');
    const optionsHintAttrs = {
      class: 'btn btn-sm btn-default overlay-lnk',
      href: '#options-hint',
      "aria-controls": 'options-hint',
      role: 'button'
    };
    optionsHint.insertAdjacentText('afterbegin', '?');
    for (let [key, value] of Object.entries(optionsHintAttrs)){
      optionsHint.setAttribute(key, value);
    }
    ctrlDiv.setAttribute('class', 'view-control');
    buttonDiv.setAttribute('class', 'view-mode-control btn-group-sm btn-group');
    buttons.forEach(function(btn, idx){
      const chartIds = [ 'byAll', 'byGrade', 'bySex' ];
      const btnText = [ 'All responses', 'Grade relative', 'Sex relative' ];
      btn.setAttribute('class', 'btn btn-default wb-toggle');
      btn.setAttribute('data-toggle', `{ "selector": "#${self.slug}-${chartIds[idx]}","group": ".chart-${self.slug}","type": "on"}`);
      btn.insertAdjacentText('afterbegin', btnText[idx]);
      buttonDiv.appendChild(btn);
    });
    ctrlDiv.appendChild(buttonDiv);
    ctrlDiv.appendChild(optionsHint);
    headContainer.appendChild(ctrlDiv);
    return headContainer;
  }
  this.buildCharts = function(){
    const self = this;
    const chartContainer = document.createElement('div');
    chartContainer.setAttribute('class', 'indicator-chart');
    Object.keys(this.chartData).forEach(function(chart){
      let chartDiv = document.createElement('div');
      chartDiv.setAttribute('id', `${self.slug}-${chart}`);
      chartDiv.setAttribute('class', `chart chart-${self.slug}`);
      if(chart === 'byAll'){
        chartDiv.className += ' on';
      }
      chartContainer.appendChild(chartDiv);
    });
    return chartContainer;
  } 
  this.buildNotes = function(){
    const noteContainer = document.createElement('div');
    noteContainer.setAttribute('class', 'indicator-footer');
    const tabsDiv = document.createElement('div');
    tabsDiv.setAttribute('class', 'wb-tabs');
    const panelDiv = document.createElement('div');
    panelDiv.setAttribute('class', 'tabpanels');
    Object.entries(this.notes).forEach(function([key, value]){
      let noteTab = document.createElement('details');
      noteTab.setAttribute('class', `tab-${key.toLowerCase()}`);
      let noteTitle = document.createElement('summary');
      noteTitle.insertAdjacentText('afterbegin', key);
      if(Array.isArray(value)){
        noteTab.appendChild(noteTitle);
        value.forEach(function(el){
          let noteText = document.createElement('p');
          noteText.insertAdjacentText('afterbegin', el);
          noteTab.appendChild(noteText);             
        })
      }else{
        let noteText = document.createElement('p');
        noteText.insertAdjacentHTML('afterbegin', value);
        noteTab.appendChild(noteTitle);
        noteTab.appendChild(noteText);
      }
      panelDiv.appendChild(noteTab);
    });
    tabsDiv.appendChild(panelDiv);
    noteContainer.appendChild(tabsDiv);
    return noteContainer;
  }
  this.create = function(){
    const _container = this.container();
    _container.appendChild(this.buildLink());
    _container.appendChild(this.buildHeader());
    _container.appendChild(this.buildCharts());
    _container.appendChild(this.buildNotes());
    this.anchor.appendChild(_container);
  }
};
window.PMO = PMO;
})(window, document);
