/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";

export const NoShadowLink = styled(Link)`
  box-shadow: none;
  line-height: 1.5em;
  &:any-link {
    color: ${colors.brand.primary};
  }
`;
