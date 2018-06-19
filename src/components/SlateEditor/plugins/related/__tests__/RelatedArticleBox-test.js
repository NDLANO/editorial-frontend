/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { render, Simulate, wait } from 'react-testing-library';
import { RelatedArticleBox } from '../RelatedArticleBox';
import IntlWrapper from '../../../../../util/__tests__/IntlWrapper';

const wrapper = () =>
  render(
    <IntlWrapper>
      <RelatedArticleBox
        t={() => 'injected'}
        editor={{ onChange: () => {}, change: () => {} }}
        locale="nb"
        node={{}}
      />
    </IntlWrapper>,
  );

test('it goes in and out of edit mode', async () => {
  nock('http://ndla-api')
    .get(
      '/article-api/v2/articles/?language=undefined&fallback=true&type=articles&query=',
    )
    .reply(200, {});
  const { getByTestId, container } = wrapper();

  Simulate.click(getByTestId('relatedWrapper'));
  Simulate.click(getByTestId('showAddExternal'));
  expect(container.firstChild).toMatchSnapshot();

  const input = getByTestId('addExternalUrlInput');
  const inputTitle = getByTestId('addExternalTitleInput');
  input.value = 'www.vg.no';
  inputTitle.value = 'Title';
  Simulate.change(input);
  Simulate.change(inputTitle);

  Simulate.click(getByTestId('taxonomyLightboxButton'));
  await wait();

  expect(container.firstChild).toMatchSnapshot();
});
