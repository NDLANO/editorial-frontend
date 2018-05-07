/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import React from 'react';
import renderer from 'react-test-renderer';
import { DisplayOembed, getIframeSrcFromHtmlString } from '../DisplayOembed';

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

test('DisplayOembed renderers correctly', () => {
  nock('http://ndla-api/')
    .get('/oembed-proxy/v1/oembed?url=https%3A%2F%2Fndla.no%2Foembed')
    .reply(200, {
      title: 'unit test',
      type: 'rich',
      html: '<iframe src="iframe.html">',
    });

  const component = renderer.create(
    <DisplayOembed url="https://ndla.no/oembed" t={() => ''} />,
  );

  expect(component.toJSON()).toMatchSnapshot();

  return new Promise(resolve => {
    setTimeout(() => {
      expect(component.toJSON()).toMatchSnapshot();
      resolve();
    }, global.DEFAULT_TIMEOUT);
  });
});

test('DisplayOembed display error on fetch fail', () => {
  nock('http://ndla-api/')
    .get('/oembed-proxy/v1/oembed?url=https%3A%2F%2Fndla.no%2Foembed')
    .replyWithError('something awful happened');

  let component;

  try {
    component = renderer.create(
      <DisplayOembed url="https://ndla.no/oembed" t={() => 'Error message'} />,
    );
  } catch (e) {
    // Should fail noop
  }

  return new Promise(resolve => {
    setTimeout(() => {
      expect(component.toJSON()).toMatchSnapshot();
      resolve();
    }, 100);
  });
});
