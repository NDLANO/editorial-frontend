/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IStatus } from '@ndla/types-backend/search-api';
import styled from '@emotion/styled';
import { Check } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';

const IconWrapper = styled.div`
  overflow: hidden;
`;

const StyledCheckIcon = styled(Check)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.green};
`;

interface Props {
  status: IStatus | undefined;
}

const PublishedStatus = ({ status }: Props) => {
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');

  return (
    <>
      {published && (
        <IconWrapper>
          <StyledCheckIcon />
        </IconWrapper>
      )}
    </>
  );
};

export default PublishedStatus;
