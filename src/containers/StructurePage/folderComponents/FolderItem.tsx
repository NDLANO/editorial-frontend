/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { spacing, fonts, mq, breakpoints } from '@ndla/core';
import { Plus } from '@ndla/icons/action';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { Node } from '@ndla/types-taxonomy';
import SettingsMenu from './SettingsMenu';
import { Row } from '../../../components';
import Spinner from '../../../components/Spinner';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';
import AddNodeModalContent from '../AddNodeModalContent';
import AddResourceModal from '../plannedResource/AddResourceModal';
import PlannedResourceForm from '../plannedResource/PlannedResourceForm';

const StyledResourceButton = styled(ButtonV2)`
  min-height: unset;
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};

  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const StyledFolderWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  gap: ${spacing.small};
`;

const ControlButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
`;

const IconButtonContainer = styled.div`
  display: flex;
`;

interface Props {
  node: Node;
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node?: Node) => void;
  nodeChildren: Node[];
  addChildTooltip: string;
}

const FolderItem = ({
  node,
  jumpToResources,
  isMainActive,
  resourcesLoading,
  rootNodeId,
  onCurrentNodeChanged,
  nodeChildren,
  addChildTooltip,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const close = useCallback(() => setOpen(false), [setOpen]);
  const showJumpToResources = isMainActive && node.id.includes('topic');

  return (
    <StyledFolderWrapper data-testid="folderWrapper">
      {isMainActive && (
        <ControlButtonsWrapper>
          <SettingsMenu
            node={node}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
            nodeChildren={nodeChildren}
          />
          <Modal open={open} onOpenChange={setOpen} modal={false}>
            <Tooltip tooltip={addChildTooltip}>
              <IconButtonContainer>
                <ModalTrigger>
                  <IconButtonV2 size="xsmall" variant="ghost" title={addChildTooltip} aria-label={addChildTooltip}>
                    <Plus />
                  </IconButtonV2>
                </ModalTrigger>
              </IconButtonContainer>
            </Tooltip>
            <ModalContent
              forceOverlay
              size={node.id.includes('topic') ? { height: 'normal', width: 'normal' } : 'normal'}
              position="top"
            >
              {node.id.includes('topic') || node.id.includes('subject') ? (
                <TaxonomyLightbox title={t('taxonomy.addTopicHeader')}>
                  <AddResourceModal>
                    <PlannedResourceForm node={node} articleType="topic-article" onClose={close} />
                  </AddResourceModal>
                </TaxonomyLightbox>
              ) : (
                <TaxonomyLightbox
                  title={t('taxonomy.addNode', {
                    nodeType: t(`taxonomy.nodeType.${node.nodeType}`),
                  })}
                >
                  <AddNodeModalContent
                    parentNode={node}
                    rootId={rootNodeId}
                    nodeType={getNodeTypeFromNodeId(rootNodeId)}
                    onClose={close}
                  />
                </TaxonomyLightbox>
              )}
            </ModalContent>
          </Modal>
        </ControlButtonsWrapper>
      )}
      {showJumpToResources && (
        <StyledResourceButton variant="outline" disabled={resourcesLoading} onClick={() => jumpToResources?.()}>
          <Row>
            {t('taxonomy.jumpToResources')}
            {!!resourcesLoading && <Spinner appearance="small" />}
          </Row>
        </StyledResourceButton>
      )}
    </StyledFolderWrapper>
  );
};

export default FolderItem;
