

// get data from storage;
chrome.storage.sync.get(['sites'], function(result) {
	console.log('Stored sites:');
  console.log(JSON.parse(JSON.stringify(result.sites)));
  
  // give buttons names depending on siteNames in storage
  $('.site-button').each(function(i) {
    $(this).attr('name', result.sites[i].hostName);
  });
});


// event handler for button toggle
$('.buttons > button').on('click', function() {
  const $button = $(this);
  const className = $button.attr('class');
  $button.attr('class', className === 'selected-keyword' ? 'unselected-keyword' : 'selected-keyword');
});


// event handler for website toggle
$('.site-button').on('click', function() {
  const $button = $(this);
  const className = $button.attr('class');
  $button.attr('class', className === 'site-button selected-site' ? 'site-button unselected-site' : 'site-button selected-site');
});


// event handler for submitting search
$('form').on('submit', function(e) {
  e.preventDefault();
  
  // obtain search string
  const searchString = $(this).serializeArray()[0].value;
  console.log(searchString);
  
  // obtain list of button keywords
  const keywords = [];
  $('.buttons > button').each(function() {
    const $button = $(this);
    const className = $button.attr('class'), keyword = $button.html();
    if (className === 'selected-keyword') {
      keywords.push(keyword);
    }
  });
  console.log(keywords);
  
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
  
  // submit the search
  submitSearch(searchString, keywords, sites);
});


// submit search functionality

function submitSearch(searchString, keywords, sites) {
  const searchURL = createSearchURL(searchString, keywords, sites);
  console.log(searchURL);
  window.location.href = searchURL;
}


