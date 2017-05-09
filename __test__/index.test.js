/* eslint-disable no-undef */
import metaScraper from '../src/index';

const fbUrl = 'https://facebook.com';

describe('Meta scraper', () => {
  test('returns an object', () => {
    metaScraper(fbUrl)
      .then(data => {
        expect(typeof data).toBe('object');
        expect(Array.isArray(data.meta)).toBe(true);
      })
      .catch(error => {
        expect(error).toBeTruthy();
      });
  });
});
/* eslint-enable no-undef */
