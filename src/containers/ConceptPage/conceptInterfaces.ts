/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { StatusDTO, AuthorDTO, GlossExampleDTO, GlossDataDTO } from "@ndla/types-backend/concept-api";

export type ConceptType = "concept" | "gloss";

export interface ConceptFormValues {
  id?: number;
  language: string;
  revision?: number;
  status?: StatusDTO;
  visualElement: Descendant[];
  source?: string;
  tags: string[];
  title: Descendant[];
  conceptContent: Descendant[];
  created?: string;
  creators: AuthorDTO[];
  license?: string;
  processors: AuthorDTO[];
  rightsholders: AuthorDTO[];
  processed: boolean;
  supportedLanguages: string[];
  updated?: string;
  origin?: string;
  responsibleId?: string;
  conceptType: ConceptType;
  gloss?: {
    gloss: string;
    wordClass: string[];
    originalLanguage: string;
  };
  examples?: GlossExampleDTO[][];
  transcriptions?: GlossDataDTO["transcriptions"];
}
