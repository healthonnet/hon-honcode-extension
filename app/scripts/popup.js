'use strict';

var currentTab;
var query = {active: true, currentWindow: true};
moment.locale(navigator.language.substring(0,2));

chrome.tabs.query(query, function(tabs) {
  currentTab = tabs[0];
  $('h1').text(chrome.i18n.getMessage('appName'));
  $('#khresmoi').text(chrome.i18n.getMessage('khresmoiTitle'));
  $('#q').attr('placeholder',
    chrome.i18n.getMessage('khresmoiPlaceholder'));
  $('#searchSubmit').text(chrome.i18n.getMessage('khresmoiSearch'));
  honcode.setBadges(currentTab.url);
});
