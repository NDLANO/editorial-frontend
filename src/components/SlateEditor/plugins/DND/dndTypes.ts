/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element } from "slate";

export const DND_PLUGIN = "dnd";

export interface DndPluginOptions {
  /**
   * Items that cannot be dragged wherever they are
   */
  disabledElements?: Element["type"][];
  /**
   * Restricts what kind of elements can be dragged into a certain element
   * Passing an empty array means that no elements can be dragged into the element
   */
  legalChildren?: Partial<Record<Element["type"], Element["type"][]>>;
}
