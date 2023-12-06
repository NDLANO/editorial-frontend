/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossData } from '@ndla/types-backend/concept-api';
import range from 'lodash/range';
import uniq from 'lodash/uniq';

export const getGlossDataAttributes = (
  glossData: IGlossData,
): { exampleIds: string; exampleLangs: string } => ({
  // Display all examples with languages as default
  exampleIds: range(0, glossData.examples.length).join(','),
  exampleLangs: uniq(glossData.examples.flat().map((e) => e.language)).join(','),
});
