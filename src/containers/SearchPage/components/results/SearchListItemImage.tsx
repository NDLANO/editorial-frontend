/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { ImageProps, ListItemImage } from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";

const listItemStyle = css.raw({
  minWidth: "102px",
  maxWidth: "102px",
  minHeight: "77px",
  maxHeight: "77px",
});

export const SearchListItemImage = forwardRef<HTMLImageElement, ImageProps>(({ css: cssProp, ...props }, ref) => (
  <ListItemImage css={css.raw(listItemStyle, cssProp)} {...props} ref={ref} />
));
