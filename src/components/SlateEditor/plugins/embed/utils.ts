/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { Embed } from "../../../../interfaces";

export const defaultEmbedBlock = (data: Partial<Embed>) =>
  slatejsx("element", { type: data?.resource, data }, { text: "" });
