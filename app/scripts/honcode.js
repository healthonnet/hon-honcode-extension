'use strict';

var honcode = {
  config: {
    honCodeCompliance: [
      'Advertising policy',
      'Attribution',
      'Authoritative',
      'Complementarity',
      'Date',
      'Financial disclosure',
      'Justificability',
      'Privacy',
      'Transparency',
    ],
  },
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

      if (HONcodeCertificateLink === '' ||
        HONcodeCertificateLink === undefined) {
        target.title = 'No HonCode certification';
        target.addClass('invalid');
      } else {
        target.attr('title', 'HonCode certified');
        target.addClass('valid');
        target.attr('href',
          'http://services.hon.ch/cgi-bin/Plugin/redirect.pl?' +
          HONcodeCertificateLink + ' +' + langue);
      }
    });
  },

};
