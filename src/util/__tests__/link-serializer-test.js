/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/** @jsx h */

/**
 * @jest-environment node
 */

import h from 'slate-hyperscript';
import jsdom from 'jsdom';
import renderer from 'react-test-renderer';
import Html from 'slate-html-serializer';
import { learningResourceRules } from '../slateHelpers';

const serializer = new Html({
  rules: learningResourceRules,
  parseHtml: jsdom.JSDOM.fragment,
});

test('deserialize a link and a content-link in an list', () => {
  const deserialized = serializer.deserialize(
    '<ul><li> <embed data-content-id="504" data-link-text="Yrker i mediebransjen" data-resource="content-link"> </li><li> <a href="https://www.nrk.no/skole/?page=search&amp;q=Jobb%20i%20NRK" rel="noopener noreferrer" target="_blank" title="Yrker i NRK">Yrker i NRK</a> </li></ul>',
  );

  expect(deserialized.toJSON()).toMatchSnapshot();
});
test('deserialize link with spacing before link', () => {
  const deserialized = serializer.deserialize(
    '<p>Eller du kan bruke nettsidene <a href="http://www.nav.no/" rel="noopener noreferrer" target="_blank" title="nav.no">nav.no</a> . Her finnes informasjon om de ulike tjenestene.</p>',
  );
  expect(deserialized.toJSON()).toMatchSnapshot();
});

test('serialize list with a link and text', () => {
  const state = (
    <state>
      <document>
        <block type="bulleted-list">
          <block type="list-item">
            A string of <mark type="bold">bold</mark> in a{' '}
            <inline
              type="link"
              data={{
                href: 'http://slatejs.org',
                rel: 'noopener noreferrer',
                target: '_blank',
              }}>
              Slate
            </inline>{' '}
            editor!
          </block>
          <block type="list-item">
            A string of <mark type="bold">bold</mark> in a editor!
          </block>
        </block>
      </document>
    </state>
  );

  const list = serializer.serialize(state, { render: false });
  expect(renderer.create(list.first()).toJSON()).toMatchSnapshot();
});
