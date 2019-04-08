/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { DisplayExternal } from '../DisplayExternal';
import { getIframeSrcFromHtmlString } from '../../../util/htmlHelpers';

test('getIframeSrcFromHtmlString returns src attribute', () => {
  const src = getIframeSrcFromHtmlString(
    `<div>
      <iframe
        width="800"
        height="600"
        src="https://h5p-test.ndla.no/resource/3ab6850d">
      </iframe>
      <script src="https://h5p.org/h5p-resizer.js"></script>
    </div>`,
  );
  expect(src).toBe('https://h5p-test.ndla.no/resource/3ab6850d');
});

test('getIframeSrcFromHtmlString returns null id src not found', () => {
  const src = getIframeSrcFromHtmlString(
    `<div>
      <iframe
        width="800"
        height="600"
      </iframe>
      <script src="https://h5p.org/h5p-resizer.js"></script>
    </div>`,
  );
  expect(src).toBe(null);
});

test('DisplayExternal renders external correctly', () => {
  nock('http://ndla-api/')
    .persist()
    .get('/oembed-proxy/v1/oembed?url=https%3A%2F%2Fndla.no%2Foembed')
    .reply(200, {
      resource: 'external',
      title: 'unit test',
      providerName: 'Vimeo',
      type: 'rich',
      html: '<iframe src="iframe.html">',
    });

  const embed = {
    resource: 'external',
    url: 'https://ndla.no/oembed',
  };

  const component = TestRenderer.create(
    <DisplayExternal embed={embed} t={() => ''} />,
  );
  expect(component.toJSON()).toMatchSnapshot();
});

test('DisplayExternal renders iframe correctly', () => {
  const embed = {
    height: '392',
    resource: 'iframe',
    url: 'https://nb.khanacademy.org/embed_video?v=jHPr-CuvHhs',
    width: '618',
  };

  const component = TestRenderer.create(
    <DisplayExternal embed={embed} t={() => ''} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('DisplayExternal display error on fetch fail', () => {
  nock('http://ndla-api/')
    .persist()
    .get('/oembed-proxy/v1/oembed?url=https%3A%2F%2Fndla.no%2Foembed')
    .replyWithError({
      message: 'something awful happened',
      code: 'AWFUL_ERROR',
    });

  const component = TestRenderer.create(
    <DisplayExternal
      embed={{ url: 'https://ndla.no/oembed' }}
      t={() => 'Error message'}
    />,
  );

  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {}, global.DEFAULT_TIMEOUT);
});
