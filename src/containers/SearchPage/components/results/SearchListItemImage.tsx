/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ImageProps, ListItemImage } from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";
import { type Ref } from "react";

const listItemStyle = css.raw({
  minWidth: "102px",
  maxWidth: "102px",
  minHeight: "77px",
  maxHeight: "77px",
});

interface Props extends ImageProps {
  ref?: Ref<HTMLImageElement>;
}

export const SearchListItemImage = ({ css: cssProp, ...props }: Props) => (
  <ListItemImage css={css.raw(listItemStyle, cssProp)} {...props} />
);
