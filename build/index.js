'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.twitter = exports.og = exports.meta = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meta = exports.meta = function meta(url) {
  return (0, _axios2.default)(url).then(function (data) {
    try {
      // Make sure we got a valid response
      if (data.response === 'undefined') {
        return { error: true, errorMessage: 'Did not receive a valid response. Please check URL and try again.' };
      }
      // Load the return data into cheerio.
      var $ = _cheerio2.default.load(data.data);
      // Filter head tags so that we just have "meta".
      var metaTags = $('head')[0].children.filter(function (item) {
        return item.name === 'meta';
      });

      var getAttribs = function getAttribs(arr, tag) {
        if (tag.attribs) {
          arr.push(tag.attribs);
        }
        return arr;
      };
      var metaArray = metaTags.reduce(getAttribs, []);

      // Create the return object and add the meta data.
      var returnData = { error: false };
      returnData.meta = metaArray;
      returnData.pageTitle = $('title')[0].children[0].data;
      return returnData;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  }).catch(function (error) {
    return { error: true, errorMessage: error };
  });
};

// Get only Open Graph tags and return as an object.
var getOg = function getOg(obj, tag) {
  if (tag.property && tag.property.indexOf('og:') > -1) {
    obj['' + tag.property] = tag.content;
  }
  obj.error = false;
  return obj;
};

// Return Open Graph tags as an object
var og = exports.og = function og(url) {
  return meta(url).then(function (tags) {
    return tags.meta.reduce(getOg, {});
  }).catch(function (error) {
    return { error: true, errorMessage: error };
  });
};

// Get only Twitter tags and return as an object.
var getTwitter = function getTwitter(obj, tag) {
  if (tag.name && tag.name.indexOf('twitter:') > -1) {
    obj['' + tag.name] = tag.content;
  }
  obj.error = false;
  return obj;
};

// Return Twitter tags as an object
var twitter = exports.twitter = function twitter(url) {
  return meta(url).then(function (tags) {
    return tags.meta.reduce(getTwitter, {});
  }).catch(function (error) {
    return { error: true, errorMessage: error };
  });
};

var metaScraper = {
  meta: meta,
  og: og,
  twitter: twitter
};

exports.default = metaScraper;