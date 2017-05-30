/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

import config from '../src/config';

const assets = config.isProduction ? require('../htdocs/assets/assets') : require('./developmentAssets'); // eslint-disable-line import/no-unresolved


const Html = (props) => {
  const { lang, className, component, accessToken, state } = props;
  const configWithAccessToken = { ...config, accessToken };
  const content = component ? renderToString(component) : '';
  const head = Helmet.rewind();

  return (
    <html lang={lang} className={className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.script.toComponent()}
        { config.isProduction ? <link rel="stylesheet" type="text/css" href={`/assets/${assets['main.css']}`} /> : null}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic,400,600,700|Signika:400,600,300,700" />
        <link rel="shortcut icon" href={`/assets/${assets['ndla-favicon.png']}`} type="image/x-icon" />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: `window.initialState = ${serialize(state)}` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.config = ${serialize(configWithAccessToken)}` }} />
        <script src={`/assets/${assets['main.js']}`} />
        {/* <script type="text/javascript" async src={`https://cdn.mathjax.org/mathjax/2.7-latest/MathJax.js?config=/assets/${assets['mathjaxConfig.js']}`} /> */}
      </body>
    </html>
  );
};

Html.propTypes = {
  lang: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  component: PropTypes.node,
  state: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string.isRequired,
};

export default Html;
