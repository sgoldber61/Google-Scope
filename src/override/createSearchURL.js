// creates a google search url given a (should all be defined!) searchString, keywords array, and sites array
function createSearchURL(searchString, keywords, sites) {
  // create keywordString
  let keywordString;
  if (keywords.length === 0) {
    keywordString = '';
  }
  else {
    keywordString = keywords.reduce((acc, keyword) => `${acc} OR ${keyword}`);
    keywordString = `(${keywordString})`;
  }
  
  // create sites string
  let sitesString;
  if (sites.length === 0) {
    sitesString = '';
  }
  else {
    sitesString = sites.map(site => `site:${site}`).reduce((acc, site) => `${acc} OR ${site}`);
    sitesString = `(${sitesString})`;
  }
  
  // concatenate
  const concatSearchString = keywordString + (keywordString ? ' AND ' : '') + searchString + sitesString;
  
  // replace whitespace streaks (1 or more) with +
  const plusSearchString = concatSearchString.replace(/\s+/g, '+');
  
  // run encode uri component, process parentheses to be url safe, turn %2B into +, and remove https
  const encodedSearchString = encodeURIComponent(plusSearchString).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%2B/g, '+').replace(/https?%3A%2F%2F/g, '');
  
  // add https://www.google.com/search?hl=en&q= and return
  return 'https://www.google.com/search?hl=en&q=' + encodedSearchString;
}

