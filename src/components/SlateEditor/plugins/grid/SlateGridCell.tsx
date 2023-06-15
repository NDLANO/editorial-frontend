/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';

const StyledGridCell = styled.div`
  border: 1px solid ${colors.brand.light};

  > p {
    padding: 0 ${spacing.xxsmall};
    word-break: break-word;
  }

  > div,
  > figure,
  > iframe {
    width: 100% !important;
    inset: 0;
  }
`;

export default StyledGridCell;
