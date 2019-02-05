/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, wait } from 'react-testing-library';
import { RelatedArticleBox } from '../RelatedArticleBox';
import IntlWrapper from '../../../../../util/__tests__/IntlWrapper';

afterEach(cleanup);

const wrapper = () =>
  render(
    <IntlWrapper>
      <RelatedArticleBox
        t={() => 'injected'}
        editor={{ setNodeByKey: () => {} }}
        locale="nb"
        node={{}}
      />
    </IntlWrapper>,
  );

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get(
      '/article-api/v2/articles/?language=nb&fallback=true&type=articles&query=',
    )
    .reply(200, {});
  const { getByTestId, container } = wrapper();

  fireEvent.click(getByTestId('relatedWrapper'));
  fireEvent.click(getByTestId('showAddExternal'));
  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('addExternalUrlInput');
  const inputTitle = getByTestId('addExternalTitleInput');
  input.value = 'https://www.vg.no';
  inputTitle.value = 'Verdens gang';
  fireEvent.change(input);
  fireEvent.change(inputTitle);

  fireEvent.click(getByTestId('taxonomyLightboxButton'));
  await wait();

  expect(container.firstChild).toMatchSnapshot();
});
