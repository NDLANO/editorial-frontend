/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_CODEBLOCK } from "./types";

export const defaultCodeblockBlock = () =>
  slatejsx("element", { type: TYPE_CODEBLOCK, data: {}, isFirstEdit: true }, [{ text: "" }]);
