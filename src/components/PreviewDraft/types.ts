/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IDraftCopyrightDTO } from "@ndla/types-backend/draft-api";

export interface FormArticle {
  id: number;
  title?: string;
  content?: string;
  introduction?: string;
  visualElement?: string;
  published?: string;
  copyright?: IDraftCopyrightDTO;
  articleType?: string;
  language?: string;
  disclaimer?: string;
}
