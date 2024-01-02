/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "../types";

export const definitionTerm = () => slatejsx("element", { type: TYPE_DEFINITION_TERM }, [{ text: "" }]);

export const definitionDescription = () => slatejsx("element", { type: TYPE_DEFINITION_DESCRIPTION }, [{ text: "" }]);

export const definitionList = () => slatejsx("element", { type: TYPE_DEFINITION_LIST }, [definitionTerm()]);
