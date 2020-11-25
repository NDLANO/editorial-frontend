/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import EditorErrorMessage from '../EditorErrorMessage';

test('EditorErrorMessage renders', () => {
  const embed = {
    message: 'This is error',
    resource: 'error',
  };

  const component = TestRenderer.create(
    <EditorErrorMessage
      embed={embed}
      msg={embed.message}
      onRemoveClick={() => {}}
    />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
