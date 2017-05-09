'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Get only Open Graph tags and return as an object.
var getOg = function getOg(obj, tag) {
  if (tag.property && tag.property.indexOf('og:') > -1) {
    obj['' + tag.property.slice(3, tag.property.length)] = tag.content;
  }
  return obj;
};

// Get only Twitter tags and return as an object.
var getTwitter = function getTwitter(obj, tag) {
  if (tag.name && tag.name.indexOf('twitter:') > -1) {
    obj['' + tag.name.slice(8, tag.name.length)] = tag.content;
  }
  return obj;
};

exports.default = function (url) {
  return (0, _axios2.default)(url).then(function (data) {
    // Make sure we got a valid response
    if (data.response === 'undefined') {
      return { error: true, errorMessage: 'Did not receive a valid response. Please check URL and try again.' };
    }

    try {
      // Load the return data into cheerio.
      var $ = _cheerio2.default.load(data.data);
      var allTags = void 0;
      // Filter head tags so that we just have "meta".
      if ($('head')[0] && $('head')[0].children) {
        allTags = $('head')[0].children.filter(function (item) {
          return item.name === 'meta';
        });
      } else throw 'Did not receive a valid response. Please check URL and try again.';

      var getAttribs = function getAttribs(arr, tag) {
        if (tag.attribs) {
          arr.push(tag.attribs);
        }
        return arr;
      };
      var metaArray = allTags.reduce(getAttribs, []);

      // Create the return object and add the meta data.
      var returnData = { error: false };
      returnData.allTags = metaArray;

      // Add a proertry that has the processed Twitter data.
      var twitter = metaArray.reduce(getTwitter, {});
      returnData.twitter = (0, _keys2.default)(twitter).length === 0 ? false : twitter;

      // Add a property that has processed OG data.
      var og = metaArray.reduce(getOg, {});
      returnData.og = (0, _keys2.default)(og).length === 0 ? false : og;

      // Add page page title.
      returnData.pageTitle = $('title')[0].children[0].data || false;

      // Add publications date if available.
      var publishedTime = metaArray.filter(function (item) {
        return item.property && item.property === 'article:published_time';
      });
      returnData.pubDate = publishedTime.length > 0 ? publishedTime[0].content : returnData.og.pubdate ? returnData.og.pubdate : false;

      // Add page title
      returnData.title = returnData.og && returnData.og.title ? returnData.og.title : returnData.twitter && returnData.twitter.title ? returnData.twitter.title : returnData.pageTitle;

      // Add description
      var description = metaArray.filter(function (item) {
        return item.name && item.name === 'description';
      })[0].content || false;
      returnData.description = returnData.og && returnData.og.description ? returnData.og.description : returnData.twitter && returnData.twitter.description ? returnData.twitter.description : description;

      // Add image
      returnData.image = returnData.og && returnData.og.image ? returnData.og.image : returnData.twitter && returnData.twitter.image ? returnData.twitter.image : false;

      returnData.error = false;

      return returnData;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  }).catch(function (error) {
    return { error: true, errorMessage: error };
  });
};