import metaScraper from '../src/index';

const fbUrl = 'https://facebook.com';
const twitterUrl = 'https://twitter.com';

test('It exists', () => {
  expect(metaScraper.meta(fbUrl)).toBeTruthy();
})
