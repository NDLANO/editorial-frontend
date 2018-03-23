/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const connectSrc = (() => {
  const defaultConnectSrc = [
    " 'self' ",
    'https://*.ndla.no',
    'https://logs-01.loggly.com',
    'https://edge.api.brightcove.com',
    'https://*.brightcove.com',
    'https://bcsecure01-a.akamaihd.net',
    'https://hlsak-a.akamaihd.net',
    'https://*.zendesk.com',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [
      ...defaultConnectSrc,
      'http://localhost:3001',
      'ws://localhost:3001',
      'http://localhost:3100',
    ];
  }

  return defaultConnectSrc;
})();

const scriptSrc = (() => {
  const defaultScriptSrc = [
    "'self'",
    "'unsafe-inline'",
    " 'unsafe-eval'",
    'https://*.ndlah5p.com',
    'https://h5p.org',
    'https://*.ndla.no',
    'https://players.brightcove.net',
    'http://players.brightcove.net',
    'https://players.brightcove.net',
    '*.nrk.no',
    'http://nrk.no',
    'https://www.youtube.com',
    'https://s.ytimg.com',
    'https://cdn.auth0.com',
    'https://vjs.zencdn.net',
    'https://httpsak-a.akamaihd.net',
    '*.brightcove.com',
    '*.brightcove.net',
    'bcove.me',
    'bcove.video',
    '*.api.brightcove.com',
    '*.o.brightcove.com',
    'players.brightcove.net',
    'hls.ak.o.brightcove.com',
    'uds.ak.o.brightcove.com',
    'brightcove.vo.llnwd.net',
    '*.llnw.net',
    '*.llnwd.net',
    '*.edgefcs.net',
    '*.akafms.net',
    '*.edgesuite.net',
    '*.akamaihd.net',
    '*.deploy.static.akamaitechnologies.com',
    '*.cloudfront.net',
    'hlstoken-a.akamaihd.net',
    'vjs.zencdn.net',
    'ndla.no',
    '*.ndla.no',
    'cdnjs.cloudflare.com',
    'https://*.auth0.com',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [...defaultScriptSrc, 'http://localhost:3001'];
  }
  return defaultScriptSrc;
})();

export default {
  directives: {
    defaultSrc: ["'self'", 'blob:'],
    scriptSrc,
    frameSrc: [
      '*.nrk.no',
      'nrk.no',
      'https://www.tv2skole.no/',
      'https://www.scribd.com/',
      'https://www.youtube.com',
      'ndla.no',
      'https://*.ndlah5p.com',
      'https://h5p.org',
      '*.ndla.no',
      '*.slideshare.net',
      'slideshare.net',
      '*.vimeo.com',
      'vimeo.com',
      '*.ndla.filmiundervisning.no',
      'ndla.filmiundervisning.no',
      '*.prezi.com',
      'prezi.com',
      '*.commoncraft.com',
      'commoncraft.com',
      '*.embed.kahoot.it',
      '*.brightcove.net',
      'embed.kahoot.it',
      'fast.wistia.com',
      'https://khanacademy.org/',
      '*.khanacademy.org/',
      'https://*.auth0.com',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'data:',
      'cdnjs.cloudflare.com',
    ],
    imgSrc: [
      "'self'",
      'https://*.ndla.no',
      'http://metrics.brightcove.com',
      'https://httpsak-a.akamaihd.net',
      'https://*.boltdns.net',
      'https://www.nrk.no/',
      'https://ssl.gstatic.com',
      'https://www.gstatic.com',
      ' data:',
    ],
    mediaSrc: [
      "'self'",
      'blob:',
      'https://*.ndla.no',
      '*.brightcove.com',
      'brightcove.com',
    ],
    connectSrc,
    reportUri: '/csp-report',
  },
};
