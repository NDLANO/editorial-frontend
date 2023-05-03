/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import config from '../config';
import { GoogleTagMangerScript, GoogleTagMangerNoScript } from './Gtm';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST as string); // eslint-disable-line import/no-dynamic-require

interface Props {
  lang: string;
  className: string;
  component?: ReactElement;
  state?: {
    locale?: string;
  };
}

const Html = (props: Props) => {
  const { lang, className, component, state = {} } = props;

  const content = component ? renderToString(component) : '';

  return (
    <html lang={lang} className={className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <GoogleTagMangerScript />
        {assets['client.css'] && (
          <link rel="stylesheet" type="text/css" href={assets['client.css']} />
        )}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <GoogleTagMangerNoScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window._mtm = window._mtm || [];
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
          src={assets['client.js']}
          defer
          crossOrigin={(process.env.NODE_ENV !== 'production').toString()}
        />
        <script
          type="text/x-mathjax-config"
          defer
          dangerouslySetInnerHTML={{
            __html: `
              MathJax = {
                chtml:{
                  mathmlSpacing: false
                },
                options: {
                  renderActions: {
                    addMenu: [],
                    checkLoading: []
                  },
                  menuOptions: {
                    settings: {
                      zoom: "None"
                    }
                  }
                }
              };
        `,
          }}
        />
        <script
          type="text/javascript"
          defer
          src="https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/mml-chtml.js"
        />
      </body>
    </html>
  );
};

export default Html;
