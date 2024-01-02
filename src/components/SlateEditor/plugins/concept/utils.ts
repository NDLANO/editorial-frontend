/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossData, IGlossExample } from '@ndla/types-backend/concept-api';

export const generateNumbersArray = (arrayLength: number): string[] =>
  Array.from(Array(arrayLength).keys()).map((el) => el.toString());

export const generateUniqueGlossLanguageArray = (glossExamples: IGlossExample[][]): string[] =>
  Array.from(new Set(glossExamples.flat().map((e) => e.language)));

export const getGlossDataAttributes = (glossData: IGlossData): { exampleIds: string; exampleLangs: string } => ({
  // Display all examples with languages as default
  exampleIds: generateNumbersArray(glossData.examples.length).join(','),
  exampleLangs: generateUniqueGlossLanguageArray(glossData.examples).join(','),
});
