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
import ResourceItems from '../components/ResourceItems';
import {
  supplementaryResourcesMock,
  coreResourcesMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

const wrapper = () =>
  render(
    <IntlWrapper>
      <ResourceItems
        resources={[...supplementaryResourcesMock, ...coreResourcesMock]}
        contentType="subject"
        activeFilter="filter"
      />
    </IntlWrapper>,
  );

test('Can toggle relevance when one filter is chosen', async () => {
  const clickId = coreResourcesMock[0].id;
  nock('http://ndla-api')
    .get(`/taxonomy/v1/resources/${clickId}/filters?language=undefined`)
    .reply(200, [{ id: 'filter', connectionId: 'testId' }]);
  nock('http://ndla-api')
    .put(
      `/taxonomy/v1/resource-filters/testId`,
      JSON.stringify({
        relevanceId: 'urn:relevance:core',
      }),
    )
    .reply(200, []);

  const { container, getByTestId } = wrapper();
  expect(container.firstChild).toMatchSnapshot();
  Simulate.change(getByTestId(`toggleRelevance-${clickId}`));
  await wait();
  expect(nock.isDone());
});
