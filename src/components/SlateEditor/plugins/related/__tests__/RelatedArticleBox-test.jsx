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
import { render, fireEvent, cleanup, wait } from '@testing-library/react';
import { RelatedArticleBox } from '../RelatedArticleBox';
import IntlWrapper from '../../../../../util/__tests__/IntlWrapper';
import { TYPE_SECTION } from '../../section';
import { defaultRelatedBlock } from '..';

afterEach(cleanup);

const relatedArticleBlock = defaultRelatedBlock();

const wrapper = () => {
  const slate = [
    {
      type: TYPE_SECTION,
      children: [relatedArticleBlock],
    },
  ];
  const editor = createEditor();
  editor.children = slate;
  return render(
    <IntlWrapper>
      <RelatedArticleBox
        t={() => 'injected'}
        editor={editor}
        locale="nb"
        element={relatedArticleBlock}
      />
    </IntlWrapper>,
  );
};

jest.mock('slate-react');

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get('/search-api/v1/search/editorial/?context-types=standard%2C%20topic-article&page=1&query=')
    .reply(200, {});
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
