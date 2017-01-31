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

  setBadges: function(link) {
    hon_listHON.checkURL(hon_listHON.formatHREF(link)).then(function(code) {
      var prettyLink = honcode.getDomainFromUrl(link);
      if (prettyLink !== 'null.null') {
        $('#certification-domain').html(prettyLink);
      }
      if (code !== '' && code !== undefined) {
        $('#certification').addClass('certification-green');
        $('#certification-header').html(chrome.i18n.getMessage('certified'));
        $.getJSON(
          'https://www.myhealthonnet.org/index.php/en/?option=' +
          'com_honcodemembership&controller=honcodeseniority&task=' +
          'getSeniority&honconduct=' + code, function(data) {
            honcode.setSealBadge(data);
            honcode.setLoyaltyBadge(data);
            honcode.setPopularityBadge(data);
            honcode.setCountryBadge(data);
            honcode.setTypeBadge(data);
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

  setLoyaltyBadge: function(data) {
    var tooltipLoyalty = '';
    if (data.first_certification !== 0) {
      tooltipLoyalty =
        chrome.i18n.getMessage('since') + ' ' +
        moment.unix(data.first_certification).format('ll');
    }

    var years = '';
    if (data.years > 0) {
      years = data.years + '</span>' +
      '<span class="hon-text-year">' +
      chrome.i18n.getMessage('years') +
      '</span>';
    }

    $('#loyalty-badge').html(
      '<div class="v-wrapper">' +
      '<div class="img-seal" ' +
      'data-toggle="tooltip" data-placement="bottom" title="' +
      tooltipLoyalty + '">' +
      '<div class="wrapper-hon-year">' +
      '<span class="hon-number-year">' +  years +
      '</div></div>' +
      '</div>' +
      '<p class="sub-wrapper">' + chrome.i18n.getMessage('loyalty') +
      '</p>'
    );
  },

  setSealBadge: function(data) {
    var validity = 'HONcode';
    if (data.validity > 0) {
      // Calculate Expiration Date
      var day = moment.unix(data.validity);
      validity = chrome.i18n.getMessage('validUntil') + ' ' +
      day.format('MMM YYYY');
    }

    $('#seal-badge').append(
      $('<div>', {class: 'v-wrapper'}).append(
        $('<img>', {
          src: '/images/honcode/hon-logo.png',
          alt: chrome.i18n.getMessage('HonCodeCertified'),
          'data-toggle': 'tooltip',
          'data-placement': 'bottom',
          title: chrome.i18n.getMessage('HonCodeCertified'),
        })
      ).append(
        $('<p>', {class: 'sub-wrapper'}).text(validity)
      )
    );
  },

  setCountryBadge: function(data) {
    if (data.country) {
      $('#country').append(
        $('<div>', {class: 'v-wrapper'}).append(
          $('<span>', {
            class: 'flag flag-' + data.country.toLowerCase() + ' flag-size',
            'data-toggle': 'tooltip',
            'data-placement': 'bottom',
            title: chrome.i18n.getMessage(data.country.toUpperCase()),
          })
        ).append(
          $('<p>', {class: 'sub-wrapper'}).text(
            chrome.i18n.getMessage('country')
          )
        )
      );
    }
  },

  setTypeBadge: function(data) {
    var type = data.type;
    var icon;
    switch (data.type) {
      case 'Non-profit': {
        type = 'NonProfit';
        icon = '<i class="fa fa-circle fa-stack-2x white"></i>' +
          '<i class="fa fa-ban fa-stack-2x silver"></i>' +
          '<i class="fa fa-usd fa-stack-1x grey"></i>';
        break;
      }
      case 'Individual': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-user fa-stack-1x white"></i>';
        break;
      }
      case 'Commercial': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-usd fa-stack-1x white"></i>';
        break;
      }
      case 'Military': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-shield fa-stack-1x white"></i>';
        break;
      }
      case 'Network': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-sitemap fa-stack-1x white"></i>';
        break;
      }
      case 'Government': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-institution fa-stack-1x white"></i>';
        break;
      }
      case 'Organization': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-users fa-stack-1x white"></i>';
        break;
      }
      case 'Educational': {
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-graduation-cap fa-stack-1x white"></i>';
        break;
      }
      default: {
        type = 'Unknown';
        icon = '<i class="fa fa-circle fa-stack-2x grey"></i>' +
          '<i class="fa fa-question fa-stack-1x white"></i>';
      }
    }
    $('#type').html(
      '<div class="v-wrapper">' +
      '<span class="fa-stack fa-3x type-height" ' +
      'data-toggle="tooltip" data-placement="bottom" title="' +
      chrome.i18n.getMessage(type) + '">' +
      icon +
      '</span>' +
      '</div>' +
      '<p class="sub-wrapper">' +
      chrome.i18n.getMessage('websiteType') +
      '</p>'
    );
  },

  setPopularityBadge: function(data) {
    $('#popularity').append(
      $('<div>', {class: 'v-wrapper'}).append(
        $('<span>', {
          class: 'popularity-pos fa-stack fa-5x',
          'data-toggle': 'tooltip',
          'data-placement': 'bottom',
          title: chrome.i18n.getMessage('alexaRank') + ': ' +
            data.alexa_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
        }).append(
          $('<i>', {class: 'fa fa-signal signal-normal'})
        ).append(
          $('<div>', {class: 'signal signal-' + data.popularity }).append(
            $('<i>', {class: 'fa fa-signal signal-success'})
          )
        )
      ).append(
        $('<p>', {class: 'sub-wrapper'}).text(
          chrome.i18n.getMessage('popularity')
        )
      )
    );
  },
};
