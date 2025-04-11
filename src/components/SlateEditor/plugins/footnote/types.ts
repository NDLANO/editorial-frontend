/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const FOOTNOTE_ELEMENT_TYPE = "footnote";
export const FOOTNOTE_PLUGIN = "footnote";

export interface FootnoteElement {
  type: "footnote";
  data: {
    authors: string[];
    title: string;
    year: string;
    resource: string;
    edition: string;
    publisher: string;
    type?: string;
  };
  children: Descendant[];
}
