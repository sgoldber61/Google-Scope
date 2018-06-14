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

  
const siteNames = ['stackoverflow.com', 'github.com', 'developer.mozilla.org/en-US/docs/Web', 'medium.com', 'www.w3schools.com', 'youtube.com', 'www.reddit.com/r/learnprogramming', 'en.wikipedia.org/wiki/Main_Page'];

chrome.storage.sync.set({siteNames}, function() {
	console.log('siteNames is set to ' + siteNames);
});



// right click stuff

/*
chrome.contextMenus.create({title: "Add site to ", contexts: ["selection"], onclick: addSiteToStorage});

function addSiteToStorage() {
  console.log('hi');
  console.log(window.location.href);
}
*/

