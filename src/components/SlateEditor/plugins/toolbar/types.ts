/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AreaFilters, CategoryFilters, ToolbarValue, ToolbarValues } from "./toolbarState";

export const TOOLBAR_PLUGIN = "toolbar";

export interface ToolbarPluginOptions {
  options?: CategoryFilters;
  areaOptions?: AreaFilters;
}

export interface ToolbarCategoryProps<T extends ToolbarValues> {
  options: ToolbarValue<T>[];
}
