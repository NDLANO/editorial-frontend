/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Schema, Value } from 'slate';
import { schema as tableSchema } from '../schema';
import { tableSlateValue } from '../../../../../util/__tests__/slateMockValues';
import { toJSON } from '../../../../../util/slateHelpers';

test('normalize table', () => {
  const value = Value.fromJSON(tableSlateValue);
  const schema = Schema.fromJSON(tableSchema);
  const change = value.change().normalize(schema);
  expect(toJSON(change.value)).toMatchSnapshot();
});
