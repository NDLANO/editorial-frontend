/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { ReactNode, useMemo } from 'react';
import styled from '@emotion/styled';
import { spacing, fonts } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { Dictionary } from '../../../interfaces';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import { ResourceGroupBanner, StyledShareIcon } from '../styles';
import ApproachingRevisionDate from './ApproachingRevisionDate';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';
import GroupResourceSwitch from './GroupResourcesSwitch';

const PublishedText = styled.div`
  font-weight: ${fonts.weight.normal};
`;

const BannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

const ControlWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;
const RightContent = styled(Content)`
  gap: ${spacing.small};
  justify-content: space-between;
`;

const getPublishedCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const publishedCount = contentMetaList.filter(c => c.status?.current === 'PUBLISHED').length;
  return publishedCount;
};

interface Props {
  title: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ChildNodeType;
  onCurrentNodeChanged: (changedNode: ChildNodeType) => void;
  addButton?: ReactNode;
  articleIds?: number[];
}

const ResourceBanner = ({
  title,
  contentMeta,
  currentNode,
  onCurrentNodeChanged,
  addButton,
  articleIds,
}: Props) => {
  const elementCount = Object.values(contentMeta).length;
  const publishedCount = useMemo(() => getPublishedCount(contentMeta), [contentMeta]);
  const { t } = useTranslation();

  return (
    <ResourceGroupBanner>
      <BannerWrapper>
        <RightContent>
          <ButtonV2
            size="small"
            variant="outline"
            onClick={() =>
              document.getElementById(currentNode.id)?.scrollIntoView({ block: 'center' })
            }>
            {t('taxonomy.jumpToStructure')}
          </ButtonV2>
          <ControlWrapper>
            <PublishedText>{`${publishedCount}/${elementCount} publisert`}</PublishedText>
            <ApproachingRevisionDate articleIds={articleIds} />
            {currentNode && currentNode.id && (
              <GroupResourceSwitch
                node={currentNode}
                onChanged={partialMeta => {
                  onCurrentNodeChanged({
                    ...currentNode,
                    metadata: { ...currentNode.metadata, ...partialMeta },
                  });
                }}
              />
            )}
          </ControlWrapper>
        </RightContent>

        <Content>
          <StyledShareIcon />
          {title}
          {addButton}
        </Content>
      </BannerWrapper>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
