import axios from 'axios';
import cheerio from 'cheerio';
import keys from 'object-keys';

// Get only Open Graph tags and return as an object.
const getOg = (obj, tag) => {
  if (tag.property && tag.property.indexOf('og:') > -1) {
    obj[`${tag.property.slice(3, tag.property.length)}`] = tag.content;
  }
  return obj;
};

// Get only Twitter tags and return as an object.
const getTwitter = (obj, tag) => {
  if (tag.name && tag.name.indexOf('twitter:') > -1) {
    obj[`${tag.name.slice(8, tag.name.length)}`] = tag.content;
  }
  return obj;
};

const metaScraper = (url) => (
  axios(url)
    .then(data => {
      // Make sure we got a valid response
      if (data.response === 'undefined') {
        return { error: true, errorMessage: 'Did not receive a valid response. Please check URL and try again.' };
      }

      try {
        // Load the return data into cheerio.
        const $ = cheerio.load(data.data);
        let allTags;
        // Filter head tags so that we just have "meta".
        if ($('head')[0] && $('head')[0].children) {
          allTags = $('head')[0].children.filter(item => item.name === 'meta');
        }
        else throw 'Did not receive a valid response. Please check URL and try again.';

        const getAttribs = (arr, tag) => {
          if (tag.attribs) {
            arr.push(tag.attribs);
          }
          return arr;
        };
        const metaArray = allTags.reduce(getAttribs, []);

        // Create the return object and add the meta data.
        const returnData = { error: false };
        returnData.allTags = metaArray;

        // Add a proertry that has the processed Twitter data.
        const twitter = metaArray.reduce(getTwitter, {});
        returnData.twitter = keys(twitter).length === 0 ? false : twitter;

        // Add a property that has processed OG data.
        const og = metaArray.reduce(getOg, {});
        returnData.og = keys(og).length === 0 ? false : og;

        // Add page page title.
        returnData.pageTitle = $('title')[0].children[0].data || false;

        // Add publications date if available.
        const publishedTime = metaArray.filter(item => item.property && item.property === 'article:published_time');
        returnData.pubDate = publishedTime.length > 0 ? publishedTime[0].content : returnData.og.pubdate ? returnData.og.pubdate : false;

        // Add page title
        returnData.title = returnData.og && returnData.og.title ? returnData.og.title : returnData.twitter && returnData.twitter.title ? returnData.twitter.title : returnData.pageTitle;

        // Add description
        const descriptions = metaArray.filter(item => item.name && item.name === 'description');
        const description = descriptions.length ? descriptions[0].content : false;
        returnData.description = returnData.og && returnData.og.description ? returnData.og.description : returnData.twitter && returnData.twitter.description ? returnData.twitter.description : description;

        // Add image
        returnData.image = returnData.og && returnData.og.image ? returnData.og.image : returnData.twitter && returnData.twitter.image ? returnData.twitter.image : false;

        returnData.error = false;

        return returnData;
      }
      catch (error) {
        return { error: true, errorMessage: error };
      }
    })
    .catch(error => ({ error: true, errorMessage: error }))
);

export default metaScraper;
