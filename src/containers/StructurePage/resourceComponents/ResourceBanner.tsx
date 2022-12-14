/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { fonts } from '@ndla/core';
import { Share } from '@ndla/icons/lib/common';

const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: 10px;
  margin: ${spacing.small} 0px;
`;

const StyledIcon = styled(Share)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;

interface Props {
  title: string;
}

const ResourceBanner = ({ title }: Props) => {
  return (
    <ResourceGroupBanner>
      <StyledIcon />
      {title}
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
