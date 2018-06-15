window.addEventListener('load', function() {
  this.focus();
  document.body.focus();
});

const defaultSiteNames = ['stackoverflow.com', 'github.com', 'developer.mozilla.org', 'medium.com', 'www.w3schools.com', 'youtube.com', 'www.reddit.com', 'en.wikipedia.org'];
const defaultSiteImages = ["./assets/stack.png", "./assets/github.png", "./assets/mdn.png", "./assets/medium.png", "./assets/w3.png", "./assets/youtube.png", "./assets/reddit.png", "./assets/wiki.png"];
const defaultSiteData = [];
for (let i = 0; i < defaultSiteNames.length; i++) {
  defaultSiteData.push({hostName: defaultSiteNames[i], image: defaultSiteImages[i]});
}


// get data from storage. load both sites and keywords
chrome.storage.sync.get(['sites', 'keywords'], function(result) {
  console.log('Stored keywords:');
  console.log(JSON.parse(JSON.stringify(result.keywords)));
  
  // dynamically create keyword buttons
  // $('#new-term-div')
  for (const keyword of result.keywords) {
    createKeywordButton(keyword);
  }
  
  // give site buttons names depending on siteNames in storage
  $('.site-button').each(function(i) {
    $(this).attr('name', result.sites[i].hostName);
  });
  
  // event handler for button toggle
  $('.buttons button:not("#input-button")').on('click', keywordButtonEventListener);
  $('.buttons i:not("#new-term-x")').on('click', keywordDeleteEventListener);
  
  console.log('Stored sites:');
  console.log(JSON.parse(JSON.stringify(result.sites)));
  
  // dynamically create websites
  for (const site of result.sites) {
    createSiteButton(site);
  }
  
  
  // event handler for website toggle
  $('.site-button').on('click', function() {
    const $button = $(this);
    const className = $button.attr('class');
    $button.attr('class', className === 'site-button selected-site' ? 'site-button unselected-site' : 'site-button selected-site');
  });

});

// sites helper functions and listeners
function createSiteButton(site) {
  let $el;
  let defaultImage = '';
  for (const defaultSite of defaultSiteData) {
    if (site.hostName === defaultSite.hostName) {
      defaultImage = defaultSite.image;
      break;
    }
  }
  
  // is this a default site?
  if (defaultImage) {
    $el = $(`<div class="site">
      <button name=${site.hostName}>
          <img src=${defaultImage} style="width:150px;  height:150px">
      </button>
    </div>`);
    $el.find('button').attr('class', site.selected ? "site-button selected-site" : "site-button unselected-site");
  }
  else {
    $el = $(`<div class="site">
    <p class="new-title">${site.title}</p>
    <button name=${site.hostName}>
      <img src="./assets/default.png " alt="Default">
    </button>
  </div>`);
    $el.find('button').attr('class', site.selected ? "site-button selected-site" : "site-button unselected-site");
  }
  
  
  $('.websites').append($el);
  return $el;
}



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
  const searchSites = [];
  $('.site-button').each(function(i) {
    const $button = $(this);
    const className = $button.attr('class'), site = $button.attr('name');
    
    // title
    let title;
    // default site title?
    const alt = $button.find('img').attr('alt');
    if (alt !== 'Default') {
      title = '';
    }
    else {
      title = $button.parent().find('p').html();
    }
    
    if (className === 'site-button selected-site') {
      searchSites.push(site);
      sites.push({hostName: site, title, selected: true});
    }
    else {
      sites.push({hostName: site, title, selected: false});
    }
  });
  console.log(searchSites);
  
  // store data
  console.log(sites);
  storeKeywordTerms(keywords, sites);
  
  // submit the search
  submitSearch(searchString, searchKeywords, searchSites);
});

// store data fucntionality
function storeKeywordTerms(keywords, sites) {
  chrome.storage.sync.set({keywords, sites}, function() {
    console.log('keywords data');
    console.log(keywords);
    
    console.log('sites data');
    console.log(sites);
  });
}


// submit search functionality

function submitSearch(searchString, searchKeywords, sites) {
  const searchURL = createSearchURL(searchString, searchKeywords, sites);
  console.log(searchURL);
  window.location.href = searchURL;
}


