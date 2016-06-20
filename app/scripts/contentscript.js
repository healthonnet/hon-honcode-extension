'use strict';

var requestHonCode = function(event, link) {
  var domain = honcode.getDomainFromUrl(link);
  var layerId = 'layer' + event.target.id;
  var $logoId =  $(event.target);

  var popUp = '<div class="honPopup" style="display: none" ' +
    'id="' + layerId + '">' +
    '<div class="honPopup-header">' + domain + '</div>' +
    '<div class="k-infos trustability">' +
    '<h4>Show Certificate</h4>' +
    '<div class="hon trb">' +
    '<a target="_blank" ' +
    'class="honTrust">' +
    '</a></div></div>' +
    '<div class="k-infos principles">' +
    '<h4>Hon Principles</h4><ul>' +
    '<li>Authority</li>' +
    '<li>Complementarity</li>' +
    '<li>Privacy policy</li>' +
    '<li>Attribution</li>' +
    '<li>Justifiability</li>' +
    '<li>Transparency</li>' +
    '<li>Financial disclosure</li>' +
    '<li>Advertising policy</li>' +
    '</ul></div>' +
    '</div>';
  $logoId.parent().append(popUp);

  var $layerId =  $('#' + layerId);
  honcode.contentHONcodeStatus($layerId.find('.honTrust'), link);

  var timeoutId;
  var hideTimeoutId;
  // Add honLogo eventListener
  $logoId.hover(function() {
    if (!timeoutId) {
      timeoutId = window.setTimeout(function() {
        timeoutId = null;
        $layerId.show();
      }, 200);
    }
  }, function() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  });

  $layerId.hover(function() {
    if (hideTimeoutId) {
      window.clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }
  }, function() {
    if (!hideTimeoutId) {
      hideTimeoutId = window.setTimeout(function() {
        hideTimeoutId = null;
        $layerId.hide();
      }, 200);
    }
  });
  $layerId.show();
};

var updateLinks = function() {
  var deferred = new $.Deferred();

  // Get links
  var links = [];
  var hrefSelector = '';
  var honCodeRequested = 0;
  // Match Google
  if (window.location.host.indexOf('google') > -1) {
    hrefSelector = 'h3.r>a';
  }
  // Match Yahoo
  else if (window.location.host.indexOf('yahoo') > -1) {
    hrefSelector = 'div.compTitle h3.title>a';
  }
  // Match Bing
  else if (window.location.host.indexOf('bing') > -1) {
    hrefSelector = 'li.b_algo h2>a';
  }
  var nodeList = document.querySelectorAll(hrefSelector);
  for (var i = 0; i < nodeList.length; ++i) {
    links[i] = nodeList[i].href;
  }
  links.forEach(function(link, index) {
    var honLogo = $(nodeList.item(index)).parent();

    var logoId = 'honLogo_' + index;

    var honCodeLogo = '<div target=\'_blank\' id="' + logoId +
      '" class="hon certificateLink"></div>';

    if (honLogo.children('.certificateLink').length === 0) {
      // Normalize Search Engine parents' behaviors
      honLogo.parent().css('overflow','visible');
      honLogo.parent().css('position','relative');
      honLogo.prepend(honCodeLogo);
      honcode.contentHONcodeStatus(honLogo.children('.certificateLink'), link);

      // Add onClick listener
      $('#' + logoId).one('click', function(e) {
        requestHonCode(e, link);
      });
    }

    honCodeRequested++;
    if (honCodeRequested === links.length) {
      deferred.resolve();
    }
  });

  return deferred.promise();
};

updateLinks().done(function() {});
