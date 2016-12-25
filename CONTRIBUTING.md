Contributing
============

Welcome, so you are thinking about contributing to HONcode Toolbar ?
Awesome, this a great place to start.

Setup
-----

You need to have Node.js.

Casperjs is used for integration testing. In order to run it you need :
 - [Python](https://www.python.org/) 2.6 or greater for casperjs in the bin/ directory

then

```bash
$ npm install
```

Test
----

```bash
$ npm test
```

Build
-----

For Chrome:

```bash
$ gulp
```

and check the `dist` directory.

For Firefox:

```bash
$ gulp build --firefox
```

and check the `distFirefox` directory.

You can use watch task to update source continuously

```bash
$ gulp watch
```

Release
-------

For Chrome:

```bash
$ gulp package
```

For Firefox:

```bash
$ gulp package --firefox
```

Enable extension on Chrome
--------------------------

 - Go to Settings ==> Extensions
 - Enable Developer mode
 - Load unpacked extension ...
 - Select /path/to/extension/dist

License
-------

Apache License 2.0
