/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Metadata, NodeChild } from "@ndla/types-taxonomy";

export interface MinimalNodeChild extends Pick<
  NodeChild,
  "id" | "relevanceId" | "isPrimary" | "path" | "name" | "connectionId" | "breadcrumbs" | "context" | "nodeType"
> {
  metadata: Pick<Metadata, "visible">;
}
