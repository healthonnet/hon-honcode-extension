'use strict';

function init() {
  // Initialise la listHON
  hon_listHON.init();
}
init();

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function checkHonCode(url) {
  hon_listHON.checkURL(hon_listHON.formatHREF(url)).then(function(code) {
    if (code) {
      chrome.browserAction.setIcon({path: 'images/icon-48.png'});
    } else {
      chrome.browserAction.setIcon({path: 'images/icon-invalid-48.png'});
    }
  });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    checkHonCode(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  checkHonCode(tab.url);
});

chrome.browserAction.onClicked.addListener(function (tab) {
  hon_listHON.checkURL(hon_listHON.formatHREF(tab.url)).then(function(code) {
    if (code){
      var action_url = 'https://www.hon.ch/HONcode/Conduct.html?' +
        code;
      chrome.tabs.create({ url: action_url });
    }
  });
});

chrome.webRequest.onCompleted.addListener(debounce(function(details) {
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'bower_components/jquery/dist/jquery.min.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'scripts/utils/tld.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'scripts/utils/md5.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'scripts/utils/hash.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'scripts/honcode.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(
      details.tabId, {
        file: 'scripts/utils/listHON.js',
        allFrames: true,
      }
    );
    chrome.tabs.executeScript(details.tabId, {
      file: 'scripts/contentscript.js',
      allFrames: true,
    });
  }, 1000), {
  urls: [
    '*://*.google.com/*',
    '*://*.google.ch/*',
    '*://*.google.fr/*',
    '*://*.google.co.uk/*',
    '*://*.google.it/*',
    '*://*.google.bg/*',
    '*://*.google.cz/*',
    '*://*.google.dk/*',
    '*://*.google.gr/*',
    '*://*.google.ee/*',
    '*://*.google.es/*',
    '*://*.google.hr/*',
    '*://*.google.lv/*',
    '*://*.google.lt/*',
    '*://*.google.hu/*',
    '*://*.google.com.mt/*',
    '*://*.google.nl/*',
    '*://*.google.pl/*',
    '*://*.google.pt/*',
    '*://*.google.ro/*',
    '*://*.google.si/*',
    '*://*.google.sk/*',
    '*://*.google.se/*',
    '*://*.bing.com/*',
    '*://*.bing.com/*',
    '*://*.search.yahoo.com/*',
  ],
  types: ['xmlhttprequest'],
});

