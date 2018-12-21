/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Value } from 'slate';
import { schema as tableSchema } from '../schema';
import { tableSlateValue } from '../../../../../util/__tests__/slateMockValues';
import { toJSON } from '../../../../../util/slateHelpers';

test('normalize table', () => {
  const value = Value.fromJSON(tableSlateValue);
  const editor = new Editor({ value, plugins: [{ tableSchema }] });
  expect(toJSON(editor.value)).toMatchSnapshot();
});
