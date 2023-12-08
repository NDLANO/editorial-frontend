/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { render } from '@testing-library/react';
import IntlWrapper from '../../../util/__tests__/IntlWrapper';
import EditorErrorMessage from '../EditorErrorMessage';

test('EditorErrorMessage renders', () => {
  const embed = {
    message: 'This is error',
    resource: 'error',
  };

  const { container } = render(
    <IntlWrapper>
      <EditorErrorMessage msg={embed.message} onRemoveClick={() => {}} />
    </IntlWrapper>,
  );

  expect(container).toMatchSnapshot();
});
