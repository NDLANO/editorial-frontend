/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeChild } from "@ndla/types-taxonomy";

export type TaxonomyNodeChild = NodeChild & { articleType?: string; isPublished?: boolean };
