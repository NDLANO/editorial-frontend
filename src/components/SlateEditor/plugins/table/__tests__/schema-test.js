/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Schema, State } from 'slate';
import tableSchema from '../schema';
import { tableSlateState } from '../../../../../util/__tests__/slateMockStates';
import { toJSON } from '../../../../../util/slateHelpers';

test('normalize table', () => {
  const state = State.fromJSON(tableSlateState);
  const schema = Schema.fromJSON(tableSchema);
  const change = state.change().normalize(schema);
  // const serializer = new Html({ rules: [tableRules], parseHtml: fragment });
  // const deserialized = serializer.deserialize(tableHTML);
  expect(toJSON(change.state)).toMatchSnapshot();
});
