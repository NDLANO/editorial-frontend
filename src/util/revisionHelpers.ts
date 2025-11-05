/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RevisionMetaDTO } from "@ndla/types-backend/draft-api";
import { Revision } from "../constants";

export const getExpirationDate = (revisions: RevisionMetaDTO[] | undefined): string | undefined => {
  if (!revisions) return undefined;

  const withParsed =
    revisions?.map((r) => {
      return { parsed: new Date(r.revisionDate), ...r };
    }) ?? [];
  const sorted = withParsed.sort((a, b) => a.parsed.getTime() - b.parsed.getTime());
  return sorted.find((r) => r.status !== Revision.revised)?.revisionDate;
};
