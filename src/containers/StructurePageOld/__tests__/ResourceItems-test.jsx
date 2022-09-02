/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResourceItems from '../resourceComponents/ResourceItems';
import {
  supplementaryResourcesMock,
  coreResourcesMock,
} from '../../../util/__tests__/taxonomyMocks';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';

afterEach(cleanup);

const wrapper = () =>
  render(
    <MemoryRouter>
      <IntlWrapper>
        <ResourceItems
          resources={[...supplementaryResourcesMock, ...coreResourcesMock]}
          contentType="topic-article"
          locale="nb"
          refreshResources={() => {}}
        />
      </IntlWrapper>
    </MemoryRouter>,
  );

test('matches snapshot', () => {
  const { container } = wrapper();
  expect(container.firstChild).toMatchSnapshot();
});
