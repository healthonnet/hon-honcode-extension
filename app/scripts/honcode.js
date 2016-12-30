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
            var tooltipLoyalty = '';
            if (data.first_certification !== 0) {
              tooltipLoyalty =
                chrome.i18n.getMessage('since') + ' ' +
                moment.unix(data.first_certification).format('ll');
            }

            $('#loyalty-badge').html(
              '<div class="v-wrapper">' +
              '<div class="img-seal">' +
              '<div class="wrapper-hon-year" ' +
              'data-toggle="tooltip" data-placement="top" title="' +
              tooltipLoyalty + '">' +
              '<span class="hon-number-year">' + data.years + '</span>' +
              '<span class="hon-text-year">' +
              chrome.i18n.getMessage('years') +
              '</span>' +
              '</div></div>' +
              '</div>' +
              '<p class="sub-wrapper">' + chrome.i18n.getMessage('loyalty') +
              '</p>'
            );

            // Show HONCode seal badge
            var validity = 'HONcode';
            if (data.validity > 0) {
              // Calculate Expiration Date
              var day = moment.unix(data.validity);
              validity = chrome.i18n.getMessage('validUntil') + ' ' +
              day.format('MMM YYYY');
            }

            $('#seal-badge').html(
              '<div class="v-wrapper">' +
              '<img src="/images/honcode/hon-logo.png" alt="' +
              chrome.i18n.getMessage('HonCodeCertified') + '" title="' +
              chrome.i18n.getMessage('HonCodeCertified') + '">' +
              '</div>' +
              '<p class="sub-wrapper">' + validity + '</p>'
            );

            // Show country
            $('#country').html(
              '<div class="v-wrapper">' +
              '<span class="flag flag-' + data.country.toLowerCase() +
              ' flag-size" ' +
              'data-toggle="tooltip" data-placement="top" title="' +
              chrome.i18n.getMessage(data.country.toUpperCase()) + '"></span>' +
              '</div>' +
              '<p class="sub-wrapper">' +
              chrome.i18n.getMessage('country') +
              '</p>'
            );

            // Show type
            var type = data.type;
            if (data.type === 'Non-profit') {
              type = 'NonProfit';
            }
            if (!data.type) {
              type = 'Unknown';
            }
            $('#type').html(
              '<div class="v-wrapper">' +
              '<i class="fa fa-cubes fa-5x type-height" ' +
              'data-toggle="tooltip" data-placement="top" title="' +
              chrome.i18n.getMessage(type) + '"></i>' +
              '</div>' +
              '<p class="sub-wrapper">' +
              chrome.i18n.getMessage(type) +
              '</p>'
            );

            // Show popularity
            $('#popularity').html(
              '<div class="v-wrapper">' +
              '<span class="popularity-pos fa-stack fa-5x">' +
              '<i class="fa fa-signal signal-normal" ' +
              'data-toggle="tooltip" data-placement="top" title="' +
              chrome.i18n.getMessage('alexaRank') + ': ' +
              data.alexa_rank + '"></i>' +
              '<div class="signal signal-' + data.popularity + '">' +
              '<i class="fa fa-signal signal-success"></i>' +
              '</div>' +
              '</span>' +
              '</div>' +
              '<p class="sub-wrapper">' +
              chrome.i18n.getMessage('popularity') +
              '</p>'
            );

            $('[data-toggle="tooltip"]').tooltip();
          });
        $('#view-certificate').html(
          '<a href="https://www.hon.ch/HONcode/Conduct.html?' +
          code +
          '" target="_blank">' +
          chrome.i18n.getMessage('viewCertificate') + '</a>'
        );
      } else {
        $('#certification').addClass('certification-grey');
        $('#certification-header').html(chrome.i18n.getMessage('uncertified'));
      }
    });
  },
};
