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

  setDate: function(link) {
    hon_listHON.checkURL(hon_listHON.formatHREF(link)).then(function(code) {
      $('#certification-domain').html(honcode.getDomainFromUrl(link));
      if (code !== '' && code !== undefined) {
        $('#certification').addClass('certification-green');
        $('#certification-header').html(chrome.i18n.getMessage('certified'));
        $.getJSON(
          'https://dev.myhealthonnet.org/index.php/en/?option=' +
          'com_honcodemembership&controller=honcodeseniority&task=' +
          'getSeniority&honconduct=' + code, function(data) {

            // Show loyalty badge information
            $('#loyalty-badge').html(
              '<div class="img-seal">' +
              '<div class="wrapper-hon-year">' +
              '<span class="hon-number-year">' + data.years + '</span>' +
              '<span class="hon-text-year">' +
              chrome.i18n.getMessage('years') +
              '</span>' +
              '</div></div>' +
              '<h3>Loyalty</h3>' // TODO: remove this placeholder
            );

            // Show HONCode seal badge
            $('#seal-badge').html(
              '<img src="/images/honcode/hon-logo.png" alt="" title="">' +
              '<h3>Nov 2017</h3>' // TODO: connect with the controller
            );
          });
        $('#seal-link').html(
          '<div class="wrapper-link">' +
          '<a class="btn btn-primary center" ' +
          'href="https://www.hon.ch/HONcode/Conduct.html?' +
          code +
          '" target="_blank">More</a>' + // TODO: remove this placeholder
          '</div>'
        );
      } else {
        $('#certification').addClass('certification-grey');
        $('#certification-header').html(chrome.i18n.getMessage('uncertified'));
        $('#badges').remove();
      }
    });
  },
};
