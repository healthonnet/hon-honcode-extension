'use strict';

var honcode = {
  setCookiesBadge: function(domain,callback) {
    chrome.cookies.getAll(
      {url: domain},
      function(cookies) {
        var cookiedensity = '';
        if (cookies.length === 0) {
          cookiedensity = 'no';
        } else if (cookies.length > 0 && cookies.length < 11) {
          cookiedensity = 'few';
        } else if (cookies.length > 10 && cookies.length < 21) {
          cookiedensity = 'more';
        } else if (cookies.length > 50) {
          cookiedensity = 'max';
        } else {
          cookiedensity = 'max';
        }
        $('#cookie-badge').append(
          $('<div>', {class: 'v-wrapper'}).append(
            $('<img>', {
              src: '/images/badge_cook_' + cookiedensity + '.jpg',
              alt: chrome.i18n.getMessage(cookiedensity + 'cookies'),
              'data-toggle': 'tooltip',
              'data-placement': 'bottom',
              title: chrome.i18n.getMessage(cookiedensity + 'cookies'),
            })
          ).append(
            $('<p>', {class: 'sub-wrapper'}).text(
              chrome.i18n.getMessage('cookies')
            )
          )
        );
      }
    );
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
        $('#certification-domain').text(prettyLink);
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
        $('#view-certificate').append(
          $('<a>', {
            href: 'https://www.hon.ch/HONcode/Conduct.html?' + code,
            target: '_blank',
          }).text(chrome.i18n.getMessage('viewCertificate'))
        );
      } else {
        $('#certification').addClass('certification-grey');
        $('#certification-header').text(chrome.i18n.getMessage('uncertified'));
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
      years = $('<span>', {class: 'hon-number-year'}).text(data.years).append(
        $('<span>', {class: 'hon-text-year'}).text(
          chrome.i18n.getMessage('years')
        )
      );
    }

    $('#loyalty-badge').append(
      $('<div>', {class: 'v-wrapper'}).append(
        $('<div>', {
          class: 'img-seal',
          'data-toggle': 'tooltip',
          'data-placement': 'bottom',
          title: tooltipLoyalty,
        }).append(
          $('<div>', {class: 'wrapper-hon-year'}).append(years)
        )
      )
    ).append(
      $('<p>', {class: 'sub-wrapper'}).text(
        chrome.i18n.getMessage('loyalty')
      )
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
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x white'}).add(
           $('<i>', {class: 'fa fa-ban fa-stack-2x silver'})).add(
             $('<i>', {class: 'fa fa-usd fa-stack-1x grey'}));
        break;
      }
      case 'Individual': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-user fa-stack-1x white'}));
        break;
      }
      case 'Commercial': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-usd fa-stack-1x white'}));
        break;
      }
      case 'Military': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-shield fa-stack-1x white'}));
        break;
      }
      case 'Network': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-sitemap fa-stack-1x white'}));
        break;
      }
      case 'Government': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-institution fa-stack-1x white'}));
        break;
      }
      case 'Organization': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-users fa-stack-1x white'}));
        break;
      }
      case 'Educational': {
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-graduation-cap fa-stack-1x white'}));
        break;
      }
      default: {
        type = 'Unknown';
        icon = $('<i>', {class: 'fa fa-circle fa-stack-2x grey'}).add(
           $('<i>', {class: 'fa fa-question fa-stack-1x white'}));
      }
    }
    $('#type').append(
      $('<div>', {class: 'v-wrapper'}).append(
        $('<span>', {
          class: 'fa-stack fa-3x type-height',
          'data-toggle': 'tooltip',
          'data-placement': 'bottom',
          title: chrome.i18n.getMessage(type),
        }).append(icon)
      )
    ).append(
      $('<p>', {class: 'sub-wrapper'}).text(
        chrome.i18n.getMessage('websiteType')
      )
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
