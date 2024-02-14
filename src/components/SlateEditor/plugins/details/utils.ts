/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DETAILS, TYPE_SUMMARY } from "./types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { defaultParagraphBlock } from "../paragraph/utils";

export const defaultSummaryBlock = () =>
  slatejsx(
    "element",
    { type: TYPE_SUMMARY },
    slatejsx("element", { type: TYPE_PARAGRAPH, serializeAsText: true }, [{ text: "" }]),
  );

export const defaultDetailsBlock = () =>
  slatejsx("element", { type: TYPE_DETAILS }, defaultSummaryBlock(), defaultParagraphBlock());
