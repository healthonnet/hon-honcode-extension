HonCode extension
=================

[![Build Status](https://travis-ci.org/healthonnet/hon-honcode-extension.svg?branch=master)](https://travis-ci.org/healthonnet/hon-honcode-extension)

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
-------------

 - Go to Settings ==> Extensions
 - Enable Developer mode
 - load unpacked extension...
 - select /path/to/extension/dist

TODO
----

 - Better Design
 - Extension options

Developers
-----------

 - Cedric FROSSARD
 - Pierre REPETTO-ANDIPATIN

License
-------
Apache Licence 2.0
