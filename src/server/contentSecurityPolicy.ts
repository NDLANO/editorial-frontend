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
    "http://api-gateway.ndla-local",
    "https://*.ndla.no",
    "https://logs-01.loggly.com",
    "https://edge.api.brightcove.com",
    "https://*.brightcove.com",
    "https://bcsecure01-a.akamaihd.net",
    "https://hlsak-a.akamaihd.net",
    "https://zendesk-eu.my.sentry.io",
    "https://*.boltdns.net",
    "https://www.googleapis.com/customsearch/",
    "https://house-fastly-signed-eu-west-1-prod.brightcovecdn.com",
    "https://www.wiris.net",
    "https://nrkno-skole-prod.kube.nrk.no",
    "https://data.udir.no",
    "https://cdn.jsdelivr.net",
    "https://widget-mediator.zopim.com",
    "wss://widget-mediator.zopim.com",
    "https://cors-anywhere.herokuapp.com",
    "https://trinket.io",
    "https://*.clarity.ms",
  ];
  if (process.env.NODE_ENV === "development") {
    return [
      ...defaultConnectSrc,
      "http://localhost:3001",
      "ws://localhost:3001",
      "http://localhost:3100",
      "http://localhost:4000",
      "http://localhost",
      "ws://localhost:24678/",
      "http://localhost:24678",
    ];
  }

  return defaultConnectSrc;
})();

const scriptSrc = (() => {
  const defaultScriptSrc = [
    "'self'",
    "'unsafe-inline'",
    " 'unsafe-eval'",
    "blob:",
    "http://api-gateway.ndla-local",
    "https://*.ndlah5p.com",
    "https://h5p.org",
    "https://*.ndla.no",
    "https://players.brightcove.net",
    "http://players.brightcove.net",
    "https://players.brightcove.net",
    "*.nrk.no",
    "http://nrk.no",
    "https://www.youtube.com",
    "https//*.youtube.com",
    "https://s.ytimg.com",
    "https://cdn.auth0.com",
    "https://vjs.zencdn.net",
    "https://httpsak-a.akamaihd.net",
    "*.brightcove.com",
    "*.brightcove.net",
    "bcove.me",
    "bcove.video",
    "*.api.brightcove.com",
    "*.o.brightcove.com",
    "players.brightcove.net",
    "hls.ak.o.brightcove.com",
    "uds.ak.o.brightcove.com",
    "brightcove.vo.llnwd.net",
    "*.llnw.net",
    "*.llnwd.net",
    "*.edgefcs.net",
    "*.akafms.net",
    "*.edgesuite.net",
    "*.akamaihd.net",
    "*.deploy.static.akamaitechnologies.com",
    "*.cloudfront.net",
    "hlstoken-a.akamaihd.net",
    "vjs.zencdn.net",
    "*.gallerysites.net",
    "ndla.no",
    "*.ndla.no",
    "cdn.jsdelivr.net",
    "https://www.wiris.net",
    "https://*.auth0.com",
    "https://zendesk-eu.my.sentry.io",
    "widget-mediator.zopim.com",
    "https://*.clarity.ms",
  ];
  if (process.env.NODE_ENV === "development") {
    return [...defaultScriptSrc, "http://localhost:3001", "ws://localhost:3001", "http://localhost:3000"];
  }
  return defaultScriptSrc;
})();

const frameSrc = (() => {
  const defaultFrameSrc = [
    "http://api-gateway.ndla-local",
    "*.nrk.no",
    "nrk.no",
    "*.vg.no",
    "vg.no",
    "https://www.tv2skole.no/",
    "*.elevkanalen.no",
    "elevkanalen.no",
    "https://www.scribd.com/",
    "https://www.youtube.com",
    "https://*.youtube.com",
    "https://youtu.be",
    "ndla.no",
    "https://*.ndlah5p.com",
    "https://h5p.org",
    "*.ndla.no",
    "*.ndla.sh",
    "*.slideshare.net",
    "slideshare.net",
    "*.vimeo.com",
    "vimeo.com",
    "*.ndla.filmiundervisning.no",
    "ndla.filmiundervisning.no",
    "*.prezi.com",
    "prezi.com",
    "*.commoncraft.com",
    "commoncraft.com",
    "*.brightcove.net",
    "fast.wistia.com",
    "https://khanacademy.org",
    "*.khanacademy.org",
    "https://*.auth0.com",
    "*.facebook.com",
    "*.twitter.com",
    "tomknudsen.no",
    "www.tomknudsen.no",
    "geogebra.org",
    "www.geogebra.org",
    "ggbm.at",
    "www.imdb.com",
    "imdb.com",
    "miljoatlas.miljodirektoratet.no",
    "www.miljostatus.no",
    "miljostatus.no",
    "phet.colorado.edu",
    "lab.concord.org",
    "worldbank.org",
    "*.worldbank.org",
    "embed.molview.org",
    "embed.ted.com",
    "reader.pubfront.com",
    "ebok.no",
    "trinket.io",
    "codepen.io",
    "public.flourish.studio",
    "flo.uri.sh",
    "ourworldindata.org",
    "*.sketchup.com",
    "www.gapminder.org",
    "https://*.clarity.ms",
    "www.facebook.com",
    "fb.watch",
    "sketchfab.com",
    "jeopardylabs.com",
    "*.uio.no",
    "*.maps.arcgis.com",
    "arcg.is",
    "norgeskart.no",
    "kartiskolen.no",
    "norgeibilder.no",
    "video.qbrick.com",
  ];
  if (process.env.NODE_ENV === "development") {
    return [
      ...defaultFrameSrc,
      "http://localhost:3001",
      "ws://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3100",
    ];
  }
  return defaultFrameSrc;
})();

const fontSrc = (() => {
  const defaultFontSrc = [
    "'self'",
    " data:",
    "https://fonts.gstatic.com",
    "https://www.wiris.net",
    "https://cdn.jsdelivr.net",
    "https://*.clarity.ms",
    "https://cdn.fontshare.com",
  ];
  if (process.env.NODE_ENV === "development") {
    return defaultFontSrc.concat("http://localhost:3001");
  }
  return defaultFontSrc;
})();

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'", "blob:"],
    scriptSrc,
    frameSrc,
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://fonts.googleapis.com",
      "https://www.wiris.net",
      "https://cdn.jsdelivr.net",
      "https://api.fontshare.com",
    ],
    fontSrc: fontSrc,
    imgSrc: [
      "'self'",
      "http://api-gateway.ndla-local",
      "https://*.ndla.no",
      "http://metrics.brightcove.com",
      "https://httpsak-a.akamaihd.net",
      "https://*.boltdns.net",
      "https://www.nrk.no/",
      "https://i.ytimg.com/",
      " data:",
      "blob:",
      "https://www.wiris.net",
      "https://*.clarity.ms",
    ],
    mediaSrc: [
      "'self'",
      "blob:",
      "http://api-gateway.ndla-local",
      "https://*.ndla.no",
      "*.brightcove.com",
      "brightcove.com",
    ],
    connectSrc,
    reportUri: "/csp-report",
    reportTo: "csp-endpoint",
  },
};
export default contentSecurityPolicy;
