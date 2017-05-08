import metaScraper from '../src/index';

const fbUrl = 'https://facebook.com';
const twitterUrl = 'http://npr.org';

describe('Meta scraper', () => {
  test('meta method returns an object', () => {
    metaScraper.meta(fbUrl)
      .then(data => {
        expect(typeof data).toBe('object');
        expect(Array.isArray(data.meta)).toBe(true);
      })
  });

  test('og method returns an object', () => {
    metaScraper.og(fbUrl)
      .then(data => {
        expect(typeof data).toBe('object');
      })
  });

  test('twitter method returns an object', () => {
    metaScraper.twitter(twitterUrl)
      .then(data => {
        expect(typeof data).toBe('object');
      })
  });
})
