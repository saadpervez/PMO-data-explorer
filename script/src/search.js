/*
 * Search for indicators and create an article with data from pmo.js
 */
(function(window, document, data){
  // define the elements of interest
  var list = document.querySelector('.indicator-list'),
      search = document.querySelector('.search-text');

  // Search the data
  function searchData(query){
    var regex = new RegExp(query, 'i');
    var found = data.filter(function(elem){
      if (regex.test(elem.pmoName) || regex.test(elem.description)){
        return elem;
      };
    });
    return found;
  }   

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
    link.setAttribute('href', indicator.pmoName.split(' ').join('-').toLowerCase());
    link.setAttribute('title', 'Link to just this indicator');
    link.appendChild(text);
    block[id].appendChild(link);
  }
  search.addEventListener('input', function(e){
    var size = e.target.value.length;
    if(size < 3){
      e.preventDefault();
    }
    else{
      setTimeout(function(){
      // Do things when something is searched
      var results = searchData(e.target.value);
      results.forEach(function(elem, idx){
        buildArticleNode();
        buildArticleLink(elem, idx);
      });        
      }, 1000);
    }
  })
})(window, document, data);
