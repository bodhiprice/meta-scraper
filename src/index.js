import axios from 'axios';
import cheerio from 'cheerio';

const genericError = { error: true, errorMessage: 'There has been an error. Please check the URL and try again.' };

export const meta = (url) => (
  axios(url)
    .then(data => {
      // Make sure we got a valid response
      if (data.response === 'undefined') {
        return { error: true, errorMessage: 'Did not receive a valid response. Please check URL and try again.' };
      }

      try {
        // Load the return data into cheerio.
        const $ = cheerio.load(data.data);
        // Filter head tags so that we just have "meta".
        const metaTags = $('head')[0].children.filter(item => item.name === 'meta');

        const getAttribs = (arr, tag) => {
          if (tag.attribs) {
            arr.push(tag.attribs);
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
      catch (error) {
        return { error: true, errorMessage: error };
      }
    })
    .catch(error => ({ error: true, errorMessage: error }))
);

// Get only Open Graph tags and return as an object.
const getOg = (obj, tag) => {
  if (tag.property && tag.property.indexOf('og:') > -1) {
    obj[`${tag.property}`] = tag.content;
  }
  obj.error = false;
  return obj;
};

// Return Open Graph tags as an object
export const og = (url) => (
  meta(url)
    .then(tags => {
      if (tags.error === false) {
        return tags.meta.reduce(getOg, {});
      }
      return genericError;
    })
    .catch(error => ({ error: true, errorMessage: error }))
);

// Get only Twitter tags and return as an object.
const getTwitter = (obj, tag) => {
  if (tag.name && tag.name.indexOf('twitter:') > -1) {
    obj[`${tag.name}`] = tag.content;
  }
  obj.error = false;
  return obj;
};

// Return Twitter tags as an object
export const twitter = (url) => (
  meta(url)
    .then(tags => {
      if (tags.error === false) {
        return tags.meta.reduce(getTwitter, {});
      }
      return genericError;
    })
    .catch(error => ({ error: true, errorMessage: error }))
);

const metaScraper = {
  meta,
  og,
  twitter
};

export default metaScraper;
