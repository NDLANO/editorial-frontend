import {
  getBrightCoveStartTime,
  addBrightCovetimeStampSrc,
  addBrightCoveTimeStampVideoid,
  addYoutubeTimeStamps,
  calcSecondsFromHMS,
  toHMS,
} from '../videoUtil';

test('util/toHMS return hms string based on seconds', () => {
  expect(typeof toHMS).toBe('function');
  const second = 1;
  const seconds = 123;
  const secondsInHours = 212401;
  expect(toHMS(second)).toBe('00:00:01');
  expect(toHMS(seconds)).toBe('00:02:03');
  expect(toHMS(secondsInHours)).toBe('59:00:01');
  expect(toHMS(-seconds)).toBe('00:02:03');
});

test('util/calcSecondsFromHMS return seconds based on hms string', () => {
  expect(typeof calcSecondsFromHMS).toBe('function');
  const ms = '2:03';
  const hms = '01:01:01';
  const hs = '01:00:01';
  const s = '01';
  const faulty = 'asdasd';
  expect(calcSecondsFromHMS(ms)).toBe(123);
  expect(calcSecondsFromHMS(hms)).toBe(3661);
  expect(calcSecondsFromHMS(hs)).toBe(3601);
  expect(calcSecondsFromHMS(s)).toBe(1);
  expect(calcSecondsFromHMS(faulty)).toBe(0);
});

test('util/addBrightCovetimeStampSrc return brightCove url with timestamp', () => {
  expect(typeof addBrightCovetimeStampSrc).toBe('function');
  const url = `https://players.brightcove.net/dummyuser/dummyplayer_default/index.html?videoId=1231241`;
  const start = '10'; // 10 seconds
  const faulty = 'asdasda';
  expect(addBrightCovetimeStampSrc(url, start)).toBe(`${url}&t=${start}s`);
  expect(addBrightCovetimeStampSrc(url, '')).toBe(`${url}`);
  expect(addBrightCovetimeStampSrc(url, faulty)).toBe(`${url}&t=0s`);
});

test('util/addBrightCoveTimeStampVideoid return brightCove videoid with timestamp', () => {
  expect(typeof addBrightCoveTimeStampVideoid).toBe('function');
  const videoid = `videoId=1231241`;
  const start = '10'; // 10 seconds
  const faulty = 'asdasda';
  expect(addBrightCoveTimeStampVideoid(videoid, start)).toBe(`${videoid}&t=${start}s`);
  expect(addBrightCoveTimeStampVideoid(videoid, '')).toBe(`${videoid}&t=`);
  expect(addBrightCoveTimeStampVideoid(videoid, faulty)).toBe(`${videoid}&t=0s`);
});

test('util/getBrightCoveStartTime return brightCove videoid with timestamp', () => {
  expect(typeof getBrightCoveStartTime).toBe('function');
  const start = '10';
  const videoid = `videoId=1231241&t=${start}s`;
  const faulty = `videoId=1231241&t=asdas`;
  expect(getBrightCoveStartTime(videoid)).toBe('00:00:10');
  expect(getBrightCoveStartTime(faulty)).toBe('');
});

test('util/addYoutubeTimeStamps return youtube url with timestamp', () => {
  expect(typeof addYoutubeTimeStamps).toBe('function');
  const start = '10';
  const stop = '20';
  const url = `https://www.youtube.com/embed/kFzViYkZAz4`;
  expect(addYoutubeTimeStamps(url, start, stop)).toBe(`${url}?end=${stop}&start=${start}`);
  expect(addYoutubeTimeStamps(url, start)).toBe(`${url}?start=${start}`);
  expect(addYoutubeTimeStamps(url, '0', stop)).toBe(`${url}?end=${stop}`);
});
