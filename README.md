# Meta tag Scraper
Retrieves the meta tags from a given web page.

## Install
```shell
npm install meta-scraper --save
```

## Usage
There are three methods available and they each return a promise that once resolved, provides an object that contains a given page's meta tags.

### meta(url)

**url**

Type: `string`

The URL of the web page you want to get the meta tags from.

### og(url)

**url**

Type: `string`

The URL of the web page you want to get the Open Graph meta tags from.

### twitter(url)

**url**

Type: `string`

The URL of the web page you want to get the Twitter meta tags from.

### Example
```javascript
// ES5 require
const metaScraper = require('meta-scraper');

// There are three methods available. All return an object. 
// The "meta" method gets all meta tags.

const getAllMeta = metaScraper.meta('https://facebook.com');

getAllMeta.then(function(data) {
  console.log(data);
  /*
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
  */
})
```
The value of the `data` variable in the example above is an object. Note that the tags are available on the `meta` property which is an array of objects:

The second method, `og`, returns an object with only Open Graph tags. This object has a slightly different structure:
```javascript
const getOpenGraph = metaScraper.og('https://facebook.com');

getOpenGraph.then(function(data) {
  console.log(data) // {'og:site_name': 'Facebook', ... , error: false}
})
```
Note that the "meta" property is no longer there and the tag names are the property names.

The third method, `twitter` is the same as `og` except it returns the Twitter tags.

**Errors**

Each object that is returned has an `error` property. If `error` is set to `true`, then there will be an additional property available, `errorMessage` that will have the error message.

