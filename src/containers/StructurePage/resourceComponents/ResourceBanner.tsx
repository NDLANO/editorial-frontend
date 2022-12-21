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
import { ResourceGroupBanner, StyledIcon } from '../styles';

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
