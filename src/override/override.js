

// get data from storage;
chrome.storage.sync.get(['siteNames'], function(result) {
	console.log('Value currently is ' + result.siteNames);
});


// event handler for button toggle
$('.buttons > button').on('click', function() {
  const $button = $(this);
  const className = $button.attr('class');
  $button.attr('class', className === 'selected-keyword' ? 'unselected-keyword' : 'selected-keyword');
});

// event handler for website toggle
$('.site-button').on('click', function() {
  const $site = $(this);
  
  
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
  
  
  
  
  // submit the search
  submitSearch(searchString, keywords);
});


// submit search functionality

function submitSearch(searchString, keywords, sites) {
  if (!sites) sites = ['www.w3schools.com', 'stackoverflow.com'];
  
  const searchURL = createSearchURL(searchString, keywords, sites);
  console.log(searchURL);
  // window.location.href = searchURL;
}


