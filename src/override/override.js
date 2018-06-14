window.addEventListener('load', function() {
  this.focus();
  document.body.focus();
});


// get data from storage. load both sites and keywords
chrome.storage.sync.get(['sites', 'keywords'], function(result) {
	console.log('Stored sites:');
  console.log(JSON.parse(JSON.stringify(result.sites)));
  
  console.log('Stored keywords:');
  console.log(JSON.parse(JSON.stringify(result.keywords)));
  
  // dynamically create keyword buttons
  // $('#new-term-div')
  for (const keyword of result.keywords) {
    createKeywordButton(keyword);
  }
  
  // 
  
  // give site buttons names depending on siteNames in storage
  $('.site-button').each(function(i) {
    $(this).attr('name', result.sites[i].hostName);
  });
  
  // event handler for button toggle
  $('.buttons button:not("#input-button")').on('click', keywordButtonEventListener);
  $('.buttons i:not("#new-term-x")').on('click', keywordDeleteEventListener);
  
  // event handler for website toggle
  $('.site-button').on('click', function() {
    const $button = $(this);
    const className = $button.attr('class');
    $button.attr('class', className === 'site-button selected-site' ? 'site-button unselected-site' : 'site-button selected-site');
  });

});

// keyword helper functions and listeners
$('#new-term-input').on('keyup', function(e) {
  if (e.key === 'Enter') {
    const keyword = {term: $(this).val(), selected: false};
    const $el = createKeywordButton(keyword);
    
    $el.children().eq(1).on('click', keywordButtonEventListener);
    $el.children().eq(0).on('click', keywordDeleteEventListener);
    
    $(this).val('');
  }
});

function createKeywordButton(keyword) {
  const $el = $(`<div class="button-flex">
      <i class="fa fa-close"></i>
      <button class=${keyword.selected ? "selected-keyword" : "unselected-keyword"}>${keyword.term}</button>
    </div>`);
  
  $('#new-term-div').before($el);
  return $el;
}

function keywordButtonEventListener() {
  const $button = $(this);
  const className = $button.attr('class');
  $button.attr('class', className === 'selected-keyword' ? 'unselected-keyword' : 'selected-keyword');
}

function keywordDeleteEventListener() {
  const $i = $(this); // the i element
  $i.parent().remove();
}


// event handler for submitting search
$('form').on('submit', function(e) {
  e.preventDefault();
  
  // obtain search string
  const searchString = $(this).serializeArray()[0].value;
  console.log(searchString);
  
  // obtain list of button keywords
  const keywords = [];
  const searchKeywords = [];
  $('.buttons button:not("#input-button")').each(function() {
    const $button = $(this);
    const className = $button.attr('class'), term = $button.html();
    if (className === 'selected-keyword') {
      searchKeywords.push(term);
      keywords.push({term, selected: true});
    }
    else {
      keywords.push({term, selected: false});
    }
  });
  
  console.log(keywords);
  console.log(searchKeywords);
  
  
  // obtain list of websites
  const sites = [];
  $('.site-button').each(function(i) {
    const $button = $(this);
    const className = $button.attr('class'), site = $button.attr('name');
    if (className === 'site-button selected-site') {
      sites.push(site);
    }
  });
  console.log(sites);
  
  // store data
  storeKeywordTerms(keywords);
  
  // submit the search
  submitSearch(searchString, searchKeywords, sites);
});

// store data fucntionality
function storeKeywordTerms(keywords) {
  chrome.storage.sync.set({keywords}, function() {
    console.log('keywords data');
    console.log(keywords);
  });
}


// submit search functionality

function submitSearch(searchString, searchKeywords, sites) {
  const searchURL = createSearchURL(searchString, searchKeywords, sites);
  console.log(searchURL);
  window.location.href = searchURL;
}


