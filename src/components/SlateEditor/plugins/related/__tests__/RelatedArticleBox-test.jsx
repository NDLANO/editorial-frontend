/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { createEditor } from 'slate';
import { withReact, Slate, Editable } from 'slate-react';
import { withHistory } from 'slate-history';
import { render, fireEvent, cleanup, wait } from '@testing-library/react';
import RelatedArticleBox from '../RelatedArticleBox';
import IntlWrapper from '../../../../../util/__tests__/IntlWrapper';
import { TYPE_SECTION } from '../../section';
import { TYPE_RELATED } from '..';

jest.mock('slate-react', () => {
  const slatereact = jest.requireActual('slate-react');
  return {
    ...slatereact,
    ReactEditor: {
      ...slatereact.ReactEditor,
      findPath: (editor, element) => {
        return [0, 0, 0];
      },
    },
  };
});

afterEach(cleanup);

const element = {
  type: TYPE_SECTION,
  children: [
    {
      type: TYPE_RELATED,
      data: {
        nodes: [
          {
            resource: 'related-content',
            'article-id': '123',
          },
          {
            resource: 'related-content',
            url: 'http://google.com',
            title: 'test-title',
          },
        ],
      },
      children: [
        {
          text: '',
        },
      ],
    },
  ],
};

const wrapper = () => {
  const editor = withHistory(withReact(createEditor()));

  return render(
    <IntlWrapper>
      <div>
        <Slate editor={editor} value={[element]} onChange={() => {}}>
          <Editable />
        </Slate>
        <RelatedArticleBox t={() => 'injected'} editor={editor} locale="nb" element={element} />
      </div>
    </IntlWrapper>,
  );
};

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get('/search-api/v1/search/editorial/?context-types=standard%2C%20topic-article&page=1&query=')
    .reply(200, { results: [] });
  const { getByTestId, container } = wrapper();

  fireEvent.click(getByTestId('showAddExternal'));
  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('addExternalUrlInput');
  const inputTitle = getByTestId('addExternalTitleInput');
  fireEvent.change(input, { target: { value: 'https://www.vg.no' } });
  fireEvent.change(inputTitle, { target: { value: 'Verdens gang' } });

  fireEvent.click(getByTestId('taxonomyLightboxButton'));
  await wait();

  expect(container.firstChild).toMatchSnapshot();
});
