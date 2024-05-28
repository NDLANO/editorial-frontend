/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";

export const StyledPreviewWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: inline-flex;
  justify-content: center;
  & [data-ndla-article] {
    padding: 0;
    margin-top: 20px;
    line-height: unset;
    font-family: unset;
    > section {
      width: unset !important;
      left: unset !important;
    }
  }
`;

export const TwoArticleWrapper = styled(StyledPreviewWrapper)`
  > div {
    margin: 0 2.5%;
    width: 40%;
    > h2 {
      margin: 0;
      margin-left: ${spacing.large};
    }
    > article {
      max-width: unset;
    }
  }
`;
