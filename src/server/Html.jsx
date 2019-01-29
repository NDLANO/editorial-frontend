/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../config';
import { GoogleTagMangerScript, GoogleTagMangerNoScript } from './Gtm';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); // eslint-disable-line import/no-dynamic-require

const Html = props => {
  const { lang, className, component, state } = props;
  const content = component ? renderToString(component) : '';
  const head = Helmet.rewind();

  return (
    <html lang={lang} className={className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <GoogleTagMangerScript />
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.script.toComponent()}
        {assets.client && assets.client.css && (
          <link rel="stylesheet" type="text/css" href={assets.client.css} />
        )}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic,400,600,700|Signika:400,600,300,700"
        />
        <link
          rel="shortcut icon"
          href="/static/ndla-favicon.png"
          type="image/x-icon"
        />
      </head>
      <body>
        <GoogleTagMangerNoScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window.originalLocation = { originalLocation: document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search };
            window.dataLayer.push(window.originalLocation);`,
          }}
        />
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.initialState = ${serialize(state)}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.config = ${serialize(config)}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.assets = ${serialize(assets)}`,
          }}
        />
        <script
          type="text/javascript"
          src={assets.client.js}
          defer
          crossOrigin={(process.env.NODE_ENV !== 'production').toString()}
        />
        <script
          type="text/x-mathjax-config"
          dangerouslySetInnerHTML={{
            __html: `
  MathJax.Hub.Config({
    jax: ["input/MathML", "output/CommonHTML"],
    extensions: ["mml2jax.js"],
    showMathMenu: false,
    showProcessingMessages: false,
    menuSettings: {
      zoom: "None"
    }
  });
        `,
          }}
        />
        <script
          type="text/javascript"
          defer
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js"
        />
      </body>
    </html>
  );
};

Html.propTypes = {
  lang: PropTypes.string.isRequired,
  component: PropTypes.node,
  state: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string.isRequired,
};

export default Html;
