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
    'http://api-gateway.ndla-local',
    'https://*.ndla.no',
    'https://logs-01.loggly.com',
    'https://edge.api.brightcove.com',
    'https://*.brightcove.com',
    'https://bcsecure01-a.akamaihd.net',
    'https://hlsak-a.akamaihd.net',
    'https://*.zendesk.com',
    'https://ekr.zdassets.com',
    'https://static.zdassets.com',
    'https://*.boltdns.net',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googleapis.com/customsearch/',
    'https://house-fastly-signed-eu-west-1-prod.brightcovecdn.com',
    'https://www.wiris.net',
    'https://nrkno-skole-prod.kube.nrk.no',
    'https://nynorsk.cloud',
    'https://data.udir.no',
    'https://cdn.jsdelivr.net',
    'https://widget-mediator.zopim.com',
    'wss://widget-mediator.zopim.com',
    'https://cors-anywhere.herokuapp.com',
    'https://trinket.io',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [
      ...defaultConnectSrc,
      'http://localhost:3001',
      'ws://localhost:3001',
      'http://localhost:3100',
      'http://localhost',
    ];
  }

  return defaultConnectSrc;
})();

const scriptSrc = (() => {
  const defaultScriptSrc = [
    "'self'",
    "'unsafe-inline'",
    " 'unsafe-eval'",
    'blob:',
    'http://api-gateway.ndla-local',
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
    '*.gallerysites.net',
    'ndla.no',
    '*.ndla.no',
    'cdn.jsdelivr.net',
    'https://www.wiris.net',
    'https://*.auth0.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://tagmanager.google.com',
    'http://www.google-analytics.com',
    'https://*.zendesk.com',
    'https://static.zdassets.com',
    'widget-mediator.zopim.com',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [
      ...defaultScriptSrc,
      'http://localhost:3001',
      'ws://localhost:3001',
      'http://localhost:3000',
    ];
  }
  return defaultScriptSrc;
})();

const frameSrc = (() => {
  const defaultFrameSrc = [
    'http://api-gateway.ndla-local',
    '*.nrk.no',
    'nrk.no',
    '*.vg.no',
    'vg.no',
    'https://www.tv2skole.no/',
    'https://www.scribd.com/',
    'https://www.youtube.com',
    'https://youtu.be',
    'ndla.no',
    'https://*.ndlah5p.com',
    'https://h5p.org',
    '*.ndla.no',
    '*.ndla.sh',
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
    'https://*.hotjar.com',
    'fast.wistia.com',
    'https://khanacademy.org',
    '*.khanacademy.org',
    'https://*.auth0.com',
    '*.facebook.com',
    '*.twitter.com',
    'e.issuu.com',
    '*.livestream.com',
    'livestream.com',
    'channel9.msdn.com',
    'tomknudsen.no',
    'www.tomknudsen.no',
    'geogebra.org',
    'www.geogebra.org',
    'ggbm.at',
    'www.imdb.com',
    'imdb.com',
    'miljoatlas.miljodirektoratet.no',
    'www.miljostatus.no',
    'miljostatus.no',
    'phet.colorado.edu',
    'lab.concord.org',
    'worldbank.org',
    '*.worldbank.org',
    'embed.molview.org',
    'embed.ted.com',
    'reader.pubfront.com',
    'ebok.no',
    'trinket.io',
    'codepen.io',
    'public.flourish.studio',
    'flo.uri.sh',
    'ourworldindata.org',
    '*.sketchup.com',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [
      ...defaultFrameSrc,
      'http://localhost:3001',
      'ws://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3100',
    ];
  }
  return defaultFrameSrc;
})();

const fontSrc = (() => {
  const defaultFontSrc = [
    "'self'",
    'https://fonts.gstatic.com',
    'https://tagmanager.google.com',
    'https://www.wiris.net',
    'https://cdn.jsdelivr.net',
  ];
  if (process.env.NODE_ENV === 'development') {
    return defaultFontSrc.concat('http://localhost:3001');
  }
  return defaultFontSrc;
})();

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'", 'blob:'],
    scriptSrc,
    frameSrc,
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://tagmanager.google.com',
      'https://www.wiris.net',
      'https://cdn.jsdelivr.net',
    ],
    fontSrc: fontSrc,
    imgSrc: [
      "'self'",
      'http://api-gateway.ndla-local',
      'https://*.ndla.no',
      'http://metrics.brightcove.com',
      'https://httpsak-a.akamaihd.net',
      'https://*.boltdns.net',
      'https://www.nrk.no/',
      'https://i.ytimg.com/',
      'https://ssl.gstatic.com',
      'https://www.gstatic.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://stats.g.doubleclick.net',
      'https://ndla.zendesk.com',
      'https://edndla.zendesk.com',
      ' data:',
      'blob:',
      'https://www.wiris.net',
    ],
    mediaSrc: [
      "'self'",
      'blob:',
      'http://api-gateway.ndla-local',
      'https://*.ndla.no',
      'https://static.zdassets.com',
      '*.brightcove.com',
      'brightcove.com',
    ],
    connectSrc,
    reportUri: '/csp-report',
  },
};
export default contentSecurityPolicy;
