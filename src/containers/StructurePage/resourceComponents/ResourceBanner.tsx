/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts } from '@ndla/core';
import { Share } from '@ndla/icons/lib/common';
import { ReactNode } from 'react';
import { Dictionary } from '../../../interfaces';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';

const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: 10px;
  margin-bottom: ${spacing.small};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledIcon = styled(Share)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;

const PublishedText = styled.div`
  font-weight: ${fonts.weight.normal};
`;

const getPublishedCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const publishedCount = contentMetaList.filter(c => c.status?.current === 'PUBLISHED').length;
  return publishedCount;
};

interface Props {
  title: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  addButton?: ReactNode;
}

const ResourceBanner = ({ title, contentMeta, addButton }: Props) => {
  const elementCount = Object.values(contentMeta).length;
  const publishedCount = getPublishedCount(contentMeta);

  return (
    <ResourceGroupBanner>
      <div>
        <StyledIcon />
        {title}
        {addButton}
      </div>
      <PublishedText>{`${publishedCount}/${elementCount} publisert`}</PublishedText>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
