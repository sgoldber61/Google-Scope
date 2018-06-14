// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


console.log('This is the beginning of background.js');

//example of using a message handler from the inject scripts

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});

// default site names
const siteNames = ['stackoverflow.com', 'github.com', 'developer.mozilla.org', 'medium.com', 'www.w3schools.com', 'youtube.com', 'www.reddit.com', 'en.wikipedia.org'];

const sites = siteNames.map(siteName => {
  return {hostName: siteName, title: ''};
});


// initialize storage with defaults

chrome.storage.sync.set({sites}, function() {
  console.log('sites data');
  console.log(sites);
});


// right click stuff

chrome.contextMenus.create({id: 'add-site-command', title: 'Add site to Google Scope', contexts: ['all']});

chrome.contextMenus.onClicked.addListener(function() {
  // console.log sanity check
  console.log('add website context menu ' + Date.now());
  
  // get the website (hostname?) and site name (title?) and add them to storage
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    const title = tab.title;
    const hostName = getHostname(tab.url);
    
    console.log(title);
    console.log(hostName);
    
    // put data into storage
    chrome.storage.sync.get(['sites'], function(result) {
      console.log('current sites:');
      console.log(JSON.parse(JSON.stringify(result.sites)));
      
      // should we add site?
      let addQ = true;
      for (const site of result.sites) {
        if (site.hostName === hostName) {
          addQ = false;
          break;
        }
      }
      if (!addQ) {
        console.log('hostName already in sites, don\'t add');
        return;
      }
      
      // add site
      result.sites.push({title, hostName});
      chrome.storage.sync.set({sites: result.sites}, function() {
        console.log('site added');
      });
    });
    
  });
});

// helper function for hostname
function getHostname(href) {
  const l = document.createElement('a');
  l.href = href;
  return l.hostname;
}


