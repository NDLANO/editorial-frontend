/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { ConceptListEmbedData } from '@ndla/types-embed';
import { ConceptListElement } from '.';
import { TYPE_CONCEPT_LIST } from './types';

export const defaultConceptListBlock = (data?: ConceptListEmbedData): ConceptListElement =>
  slatejsx('element', { type: TYPE_CONCEPT_LIST, data: data ?? {} }, { text: '' }) as ConceptListElement;
