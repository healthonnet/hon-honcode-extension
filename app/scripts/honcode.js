'use strict';

var honcode = {
  getDomainFromUrl: function(link) {
    var domain = tldjs.getDomain(link);
    var subdomain = tldjs.getSubdomain(link);
    if (subdomain === 'www') {
      subdomain = '';
    }

    return subdomain !== '' ? subdomain + '.' + domain : domain;
  },

  contentHONcodeStatus: function(target, link) {
    hon_listHON.checkURL(hon_listHON.formatHREF(link)).then(function(code) {
      var HONcodeCertificateLink = code;
      var langue = navigator.language.substring(0,2);

      if (HONcodeCertificateLink !== '' &&
        HONcodeCertificateLink !== undefined) {

        target.attr('title', chrome.i18n.getMessage('HonCodeCertified'));
        target.attr('alt', chrome.i18n.getMessage('HonCodeCertified'));
        target.addClass('valid');
        target.attr(
          'href',
          'http://services.hon.ch/cgi-bin/Plugin/redirect.pl?' +
          HONcodeCertificateLink + '+' + langue
        );
      }
    });
  },
};
