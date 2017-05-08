# Meta tag Scraper
This module retrieves the meta tags from a web page. Pass in a URL to one of its methods and it returns an object with the specified meta tags as well as the page title.

## Usage
`npm install meta-scraper`

```
// ES5 require
var metaScraper = require('meta-scraper');

// There are three methods available. All return an object. 
// The "meta" method gets all meta tags.

var getAllMeta = metaScraper.meta('https://facebook.com');
```
The value of `getAllMeta` in the example above is an object. Note that the tags are available in the `meta` property which is an array of objects:
```
{ 
  error: false,
  meta: [ 
    { charset: 'utf-8' },
    { name: 'referrer', content: 'default', id: 'meta_referrer'},
    { property: 'og:site_name', content: 'Facebook' }
    ...more tags
  ],
  pageTitle: 'Facebook - Log In or Sign Up'
}
```
The second method, `og`, returns only Open Graph tags:
```
var getOpenGraph = metaScraper.og('https://facebook.com');
```
The value of `getOpenGraph` in the example above is an object:

```
{ 
  'og:site_name': 'Facebook',
  'og:url': 'https://www.facebook.com/',
  'og:image': 'https://www.facebook.com/images/fb_icon_325x325.png',
  'og:locale': 'en_US' 
}
```
The third method, `twitter` returns the Twitter tags:

```
var getTwitter = metaScraper.twitter('http://npr.org');
```
The value of `getTwitter` in the example above is also an object:
```
{ 
  'twitter:card': 'summary_large_image',
  'twitter:site': '@NPR',
  'twitter:domain': 'npr.org',
  ...
} 
```

