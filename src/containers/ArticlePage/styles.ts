/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { COMMENT_WIDTH, SPACING_COMMENT } from './components/CommentSection';
import { MAX_PAGE_WIDTH } from '../../constants';

// Calculate the max width of edit resource page with comments displayed
export const MAX_WIDTH_WITH_COMMENTS = MAX_PAGE_WIDTH + COMMENT_WIDTH + SPACING_COMMENT;

export const articleResourcePageStyle = css`
  max-width: ${MAX_WIDTH_WITH_COMMENTS}px;
`;

export const FlexWrapper = styled.div`
  display: flex;
`;

export const MainContent = styled.div`
  flex: 1;
  max-width: ${MAX_PAGE_WIDTH}px;
`;
