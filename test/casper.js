var googleSearch     = 'Verify selectors in Google search results';
var yahooSearch      = 'Verify selectors in Yahoo search results';
var bingSearch       = 'Verify selectors in Bing search results';
var duckduckgoSearch = 'Verify selectors in Duckduckgo search results';
var wikiPage         = 'Verify selectors in Wikipedia pages';
var medlinePage      = 'Verify selectors in MedlinePlus pages';

casper.userAgent('Mozilla/5.0 (Windows NT 6.1) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

// Google
casper.test.begin(googleSearch, 1, function suite(test) {

  casper.start('http://www.google.fr/search?q=vidal', function() {
    this.waitForSelector('h3.r a');
  });

  // We need at least one real test.
  casper.then(function() {
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Yahoo
casper.test.begin(yahooSearch, 0, function suite(test) {

  casper.start('https://fr.search.yahoo.com/search?p=vidal', function() {
    this.waitForSelector('h3.title a');
  });

  casper.run(function() {
    test.done();
  });
});

// Bing
casper.test.begin(bingSearch, 0, function suite(test) {

  casper.start('http://www.bing.com/search?q=vidal', function() {
    this.waitForSelector('.b_algo h2 a');
  });

  casper.run(function() {
    test.done();
  });
});

// Duckduckgo
casper.test.begin(duckduckgoSearch, 0, function suite(test) {

  casper.start('https://duckduckgo.com/?q=vidal&t=h_&ia=web', function() {
    this.waitForSelector('h2.result__title>a.result__a');
  });

  casper.run(function() {
    test.done();
  });
});

// Wikipedia
casper.test.begin(wikiPage, 0, function suite(test) {

  casper.start('https://en.m.wikipedia.org/wiki/WebMD', function() {
    this.waitForSelector('a.external.text');
  });

  casper.run(function() {
    test.done();
  });
});

// MedlinePlus
casper.test.begin(medlinePage, 0, function suite(test) {

  casper.start('https://medlineplus.gov/triglycerides.html',
    function() {
    this.waitForSelector('.bulletlist a');
  });
  casper.run(function() {
    test.done();
  });
});
