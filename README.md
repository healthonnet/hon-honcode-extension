HonCode extension
=================

[![Build Status](https://travis-ci.org/healthonnet/hon-honcode-extension.svg?branch=master)](https://travis-ci.org/healthonnet/hon-honcode-extension)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/honcode-toolbar/migljoiadpobjnfkpmbpjekghdiilneb.svg)](https://chrome.google.com/webstore/detail/honcode-toolbar/migljoiadpobjnfkpmbpjekghdiilneb)

Add HonCode informations into google/yahoo/bing 's results


Browser Compatibilies
---------------------
 - Chrome (18+)
 - chromium based Opera versions (15.0+).

Development Prerequisites
-------------------------
Casperjs is used for integration testing. In order to run it you need :
 - [Python](https://www.python.org/)  2.6 or greater for casperjs in the bin/ directory

Build
-----

```bash
$ npm install
```

Test
----

```bash
$ npm test
```

Run
---

```bash
$ gulp
```

Or you can use watch task to update source continuously
```bash
$ gulp watch
```

Enable extension on Chrome
--------------------------

You have to package the extension:

```bash
$ gulp chrome-prod
```

Then unzip the extension in package directory.

Finally, from google Chrome:

 - Go to Settings ==> Extensions
 - Enable Developer mode
 - load unpacked extension...
 - select /package/hon code extension-VERSION_NUMBER

Usage
-----

There are 3 features:

 - Get HONcode certification in search engines, wikipedia and medline;
 - See if the current page is HONcode certified;
 - Type ```hon``` in the omnibox bar in Google Chrome and search among HONcode certified websites.

TODO
----

 - Extension options

Developers
----------

 - Cedric FROSSARD
 - Pierre REPETTO-ANDIPATIN

License
-------
Apache Licence 2.0
