# Meta tag Scraper
Retrieves the meta tags from a given web page. Common tag values (title, description, e.g.) are returned as object properties. There is also an `allTags` property which is an array of objects that contain the values of all the meta tags for the page.

## Install
```shell
npm install meta-scraper --save
```

## Usage
```javascript
// ES5 require
const metaScraper = require('meta-scraper').default;
// ES6 import
import metaScraper from 'meta-scraper';

// Returns a promise. 
metaScraper('https://facebook.com')
  .then(function(data) {
    console.log(data);
    /*
      { 
        error: false,
        allTags: [ 
          { charset: 'utf-8' },
          { name: 'referrer', content: 'default', id: 'meta_referrer'},
          { property: 'og:site_name', content: 'Facebook' }
          ...more tags
        ],
        pageTitle: 'Facebook - Log In or Sign Up',
        pubDate: false,
        title: 'Facebook - Log In or Sign Up',
        description: 'Create an account or log into Facebook. Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.',
        image: 'https://www.facebook.com/images/fb_icon_325x325.png'
      }
    */
  });
```
## Available Properties
There are a number properties that are provided along with reasonable fallbacks:

- `title`: Tries to first get the Open Graph or Twitter card title and uses pageTitle as a fallback.
- `pageTitle`: The document title. This will be `false` if document title is missing.
- `description`: Tries to first get the Open Graph or Twitter card description and uses the meta description as a fallback. This will be `false` if none of those are present.
- `pubDate`: Tries to use `article:published_time` first, then `og:pubdate` as a fallback. This is `false` if those aren't available.
- `image`:  Tries to first get the Open Graph or Twitter card image. If those aren't available, this is `false`.
- `og`: All available Open Graph tags. If those aren't available, this is `false`.
- `twitter`: All available Twitter tags. If those aren't available, this is `false`.
- `error`: If `error` is set to `true`, then there will be an additional property available, `errorMessage`, that will have the error message.
- `allTags`: This is an array of objects. Each object contains the attributes for the meta tags and all of the page's meta tags should be available on this property.  Using `Array.filter()` would be a useful way to find any tags that aren't provided by default. See the example below.

```javascript
// If we have an object named 'data' returned when the promise resolves, we can get theme color:
const themeColor = data.allTags.filter(item => item.name && item.name === 'theme-color')[0].content;
```
