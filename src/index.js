import axios from 'axios';
import cheerio from 'cheerio';

export const meta = (url) => {
  // Get the specified URL
  return axios(url)
    .then(data => {
      console.log(Object.keys(data));
      try {
        // Make sure we got a valid response
        if (data.response === 'undefined') {
          return { error: true, errorMessage: 'Did not receive a valid response. Please check URL and try again.' };
        }
        // Load the return data into cheerio.
        const $ = cheerio.load(data.data);
        // Filter head tags so that we just have "meta".
        const metaTags =  $('head')[0].children.filter(item => item.name === 'meta');
        
        const getAttribs = (arr, meta) => {
          if (meta.attribs) {
            arr.push(meta.attribs);
          }
          return arr;
        };
        const metaArray = metaTags.reduce(getAttribs, []);

        // Create the return object and add the meta data.
        const returnData = { error: false };
        returnData.meta = metaArray;
        returnData.pageTitle = $('title')[0].children[0].data;
        return returnData;
      }
      catch(error) {
        return { error: true, errorMessage: error };
      }
    })
    .catch(error => ({ error: true, errorMessage: error }));
}

// Get only Open Graph tags and return as an object.
const getOg = (obj, meta) => {
  if (meta.property && meta.property.indexOf('og:') > -1) {
    obj[`${meta.property}`] = meta.content;
  }
  obj.error = false;
  return obj;
};

// Return Open Graph tags as an object
export const og = (url) => {
  return meta(url)
    .then(meta => {
      return meta.meta.reduce(getOg, {});
    })
    .catch(error => ({ error: true, errorMessage: error }));
}

// Get only Twitter tags and return as an object.
const getTwitter = (obj, meta) => {
  if (meta.name && meta.name.indexOf('twitter:') > -1) {
    obj[`${meta.name}`] = meta.content;
  }
  obj.error = false;
  return obj;
};

// Return Twitter tags as an object
export const twitter = (url) => {
  return meta(url)
    .then(meta => {
      return meta.meta.reduce(getTwitter, {});
    })
    .catch(error => ({ error: true, errorMessage: error }));
}

const metaScraper = {
  meta,
  og,
  twitter
}

export default metaScraper;
