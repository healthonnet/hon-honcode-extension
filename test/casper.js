var googleSearch = 'Verify selectors in ' +
  'Google search results';
var yahooSearch = 'Verify selectors in ' +
  'Yahoo search results';
var bingSearch = 'Verify selectors in ' +
  'Bing search results';
var wikiPage = 'Verify selectors in ' +
  'Wikipedia pages';
var medlinePage = 'Verify selectors in ' +
  'MedlinePlus pages';


// Google
casper.test.begin(googleSearch, 3, function suite(test) {

  casper.start('http://www.google.fr/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);

    this.waitForSelector('h3.r a');
  });

  casper.then(function() {
    test.assertTitle('vidal - Recherche Google', 'google title is ok');
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Yahoo
casper.test.begin(yahooSearch, 4, function suite(test) {

  casper.start('https://fr.yahoo.com/', function() {
    test.assertExists(
      'form[action="https://fr.search.yahoo.com/search"]',
      'main form is found'
    );
    this.fill('form[action="https://fr.search.yahoo.com/search"]', {
      p: 'vidal'
    }, true);
    test.assertExists('input[name="p"]', 'input form is found');
    this.waitForSelector('h3.title a');
  });

  casper.then(function() {
    test.assertTitle('vidal - Yahoo Search - Actualités', 'yahoo title is ok');
    test.assertUrlMatch(/p=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Bing
casper.test.begin(bingSearch, 3, function suite(test) {

  casper.start('https://www.bing.com/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);
    this.waitForSelector('.b_algo h2 a');
  });

  casper.then(function() {
    test.assertTitle('vidal - Bing', 'bing title is ok');
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Wikipedia
casper.test.begin(wikiPage, 2, function suite(test) {

  casper.start('https://en.wikipedia.org/', function() {
    test.assertExists('form[action="/w/index.php"]', 'main form is found');
    this.fill('form[action="/w/index.php"]', {
      search: 'webmd'
    }, true);
    this.waitForSelector('a.external.text');
  });

  casper.then(function() {
    test.assertTitle('WebMD - Wikipedia', 'wikipedia title is ok');
  });

  casper.run(function() {
    test.done();
  });
});

// Mediaplus
casper.test.begin(medlinePage, 1, function suite(test) {

  casper.start('https://medlineplus.gov/triglycerides.html',
    function() {
    this.waitForSelector('a.reveal');
  });
  casper.then(function() {
    test.assertTitle('Triglycerides: MedlinePlus', 'medline plus title is ok');
  });
  casper.run(function() {
    test.done();
  });
});
