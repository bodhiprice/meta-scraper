'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.twitter = exports.Og = exports.meta = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meta = exports.meta = function meta(url) {
  // Get the specified URL
  return (0, _axios2.default)(url).then(function (data) {
    try {
      // Load the return data into cheerio.
      var $ = _cheerio2.default.load(data.data);
      // Filter head tags so that we just have "meta".
      var metaTags = $('head')[0].children.filter(function (item) {
        return item.name === 'meta';
      });

      var getAttribs = function getAttribs(arr, meta) {
        if (meta.attribs) {
          arr.push(meta.attribs);
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
var getOg = function getOg(obj, meta) {
  if (meta.property && meta.property.indexOf('og:') > -1) {
    obj['' + meta.property] = meta.content;
  }
  return obj;
};

// Return Open Graph tags as an object
var Og = exports.Og = function Og(url) {
  return meta(url).then(function (meta) {
    return meta.meta.reduce(getOg, {});
  });
};

// Get only Twitter tags and return as an object.
var getTwitter = function getTwitter(obj, meta) {
  if (meta.name && meta.name.indexOf('twitter:') > -1) {
    obj['' + meta.name] = meta.content;
  }
  return obj;
};

// Return Open Graph tags as an object
var twitter = exports.twitter = function twitter(url) {
  return meta(url).then(function (meta) {
    return meta.meta.reduce(getTwitter, {});
  });
};

exports.default = {
  meta: meta,
  Og: Og
};


twitter('https://lullabot.com').then(function (data) {
  console.log(data);
});
