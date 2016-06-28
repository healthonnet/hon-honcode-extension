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
      chrome.browserAction.setTitle({
        title: chrome.i18n.getMessage('iconTooltipValid')
      });
    } else {
      chrome.browserAction.setIcon({path: 'images/icon-invalid-48.png'});
      chrome.browserAction.setTitle({
        title: chrome.i18n.getMessage('iconTooltipInvalid')
      });
    }
  });
}

chrome.omnibox.onInputEntered.addListener(function(text) {
  var url = 'https://www.hon.ch/HONcode/Search/search.html';
  if (text) {
    url += '?siteurl=&cref=http%3A%2F%2Fwww.hon.ch' +
    '%2FCSE%2FHONCODE%2Fcontextlink.xml&sa=Search&hl=en&cof=FORID%3A11&q=' +
    encodeURIComponent(text);
  }
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    checkHonCode(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    checkHonCode(tabs[0].url);
  });
});

chrome.windows.onFocusChanged.addListener(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    checkHonCode(tabs[0].url);
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  hon_listHON.checkURL(hon_listHON.formatHREF(tab.url)).then(function(code) {
    if (code) {
      var language   = navigator.language.substring(0,2);
      var action_url = 'http://services.hon.ch/cgi-bin/Plugin/redirect.pl?' +
        code + '+' + language;
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
    '*://*.wikipedia.org/*',
    '*://*.nlm.nih.gov/medlineplus/*',
  ],
  types: ['xmlhttprequest'],
});
