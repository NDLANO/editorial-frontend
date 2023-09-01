/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { spacing, fonts } from '@ndla/core';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { NodeChild, ResourceType } from '@ndla/types-taxonomy';
import { useTranslation } from 'react-i18next';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { Plus } from '@ndla/icons/action';
import { FieldHeader } from '@ndla/forms';
import Tooltip from '@ndla/tooltip';
import { Dictionary } from '../../../interfaces';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import { ResourceGroupBanner, StyledShareIcon } from '../styles';
import ApproachingRevisionDate from './ApproachingRevisionDate';
import GroupResourceSwitch from './GroupResourcesSwitch';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import AddResourceModal from '../plannedResource/AddResourceModal';
import PlannedResourceForm from '../plannedResource/PlannedResourceForm';
import AddExistingResource from '../plannedResource/AddExistingResource';

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
  gap: ${spacing.xxsmall};
`;
const RightContent = styled(Content)`
  gap: ${spacing.small};
  justify-content: space-between;
`;

const getPublishedCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const publishedCount = contentMetaList.filter((c) => c.status?.current === 'PUBLISHED').length;
  return publishedCount;
};

interface Props {
  title: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: NodeChild;
  onCurrentNodeChanged: (changedNode: NodeChild) => void;
  resources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: Pick<ResourceType, 'id' | 'name'>[];
  articleIds?: number[];
}

const ResourceBanner = ({
  title,
  contentMeta,
  currentNode,
  onCurrentNodeChanged,
  resourceTypes,
  resources,
}: Props) => {
  const [open, setOpen] = useState(false);
  const elementCount = Object.values(contentMeta).length;
  const publishedCount = useMemo(() => getPublishedCount(contentMeta), [contentMeta]);
  const { t } = useTranslation();
  const allRevisions = useMemo(() => {
    const resourceRevisions = resources.map((r) => r.contentMeta?.revisions).filter((r) => !!r);
    const currentNodeRevision = currentNode.contentUri
      ? contentMeta[currentNode.contentUri]?.revisions
      : undefined;
    return resourceRevisions.concat([currentNodeRevision]);
  }, [contentMeta, currentNode.contentUri, resources]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <ResourceGroupBanner>
      <BannerWrapper>
        <RightContent>
          <ButtonV2
            size="small"
            variant="outline"
            onClick={() =>
              document.getElementById(currentNode.id)?.scrollIntoView({ block: 'center' })
            }
          >
            {t('taxonomy.jumpToStructure')}
          </ButtonV2>
          <ControlWrapper>
            <PublishedText>{`${publishedCount}/${elementCount} ${t(
              'form.notes.published',
            ).toLowerCase()}`}</PublishedText>
            <ApproachingRevisionDate revisions={allRevisions} />
            {currentNode && currentNode.id && (
              <GroupResourceSwitch
                node={currentNode}
                onChanged={(partialMeta) => {
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
          <Modal open={open} onOpenChange={setOpen}>
            <Tooltip tooltip={t('taxonomy.addResource')}>
              <ModalTrigger>
                <IconButtonV2 size="xsmall" variant="ghost" aria-label={t('taxonomy.addResource')}>
                  <Plus />
                </IconButtonV2>
              </ModalTrigger>
            </Tooltip>
            <ModalContent size={{ width: 'normal', height: 'normal' }} position="top">
              <TaxonomyLightbox title={t('taxonomy.addResource')}>
                <AddResourceModal>
                  <FieldHeader title={t('taxonomy.createResource')} />
                  <PlannedResourceForm onClose={close} articleType="standard" node={currentNode} />
                  <FieldHeader title={t('taxonomy.getExisting')} />
                  <AddExistingResource
                    resourceTypes={resourceTypes}
                    nodeId={currentNode.id}
                    onClose={close}
                    existingResourceIds={resources.map((r) => r.id)}
                  />
                </AddResourceModal>
              </TaxonomyLightbox>
            </ModalContent>
          </Modal>
        </Content>
      </BannerWrapper>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
