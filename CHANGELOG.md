HONcode Toolbar Changelog
=========================

### v2.2.0 / 2017-02-28
 - feat: rewrite DOM trees creation (avoid invoking the DOM parser)
 - feat: add donate link in footer
 - fix: popup layout with empty domain
 - fix: update some translations
 - chore: update md5 list url
 - chore: add contributors list in README
 - chore: add small promo image for chrome store

### v2.1.1 / 2017-01-12
 - chore: clean unit test
 - chore: clean dump call to console.error
 - chore: move jQuery out of bundle in popup
 - fix: missing reportError methods

### v2.1.0 / 2017-01-05
 - fix: tabs.getSelected was deprecated
 - chore: clean unnecessary file dependencies
 - feat: add a popup
 - chore: url in lower case
 - feat: add certified sites country to popup
 - feat: add certified sites type to popup
 - feat: add certified sites popularity to popup
 - chore: clean manifest
 - fix: show placeholder when validity is 0
 - feat: add tooltips
 - feat: add dedicated icons for each type
 - refactor: gulp
 - feat: add footer
 - feat: remove loyalty text for less than a year loyal websites

### v2.0.2 / 2016-12-25
 - Add package firefox option
 - Rename `bower_components` folder as `lib`
 - Don't minify files containing `*.min.js`
 - Improve README

### v2.0.1 / 2016-12-21

 - Initial release for Firefox (as Web Extension)
 - Disable Wikipedia and MedlinePlus feature in Firefox
 - Add build firefox option
 - Update gulp-if dependency

### v2.0.0 / 2016-06-29

 - Initial release for Chrome
