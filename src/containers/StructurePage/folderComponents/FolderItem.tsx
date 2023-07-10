/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing, fonts, mq, breakpoints } from '@ndla/core';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { Plus } from '@ndla/icons/action';
import { Node } from '@ndla/types-taxonomy';
import { Row } from '../../../components';
import Spinner from '../../../components/Spinner';
import SettingsMenu from './SettingsMenu';

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
`;

interface Props {
  node: Node;
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node?: Node) => void;
  nodeChildren: Node[];
  setShowAddChildModal: (value: boolean) => void;
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
  setShowAddChildModal,
  addChildTooltip,
}: Props) => {
  const { t } = useTranslation();
  const showJumpToResources = isMainActive && node.id.includes('topic');

  return (
    <StyledFolderWrapper data-cy="folderWrapper">
      {isMainActive && (
        <ControlButtonsWrapper>
          <SettingsMenu
            node={node}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
            nodeChildren={nodeChildren}
          />
          <Tooltip tooltip={addChildTooltip}>
            <IconButtonV2
              onClick={() => setShowAddChildModal(true)}
              size="xsmall"
              variant="stripped"
              aria-label={addChildTooltip}
            >
              <Plus />
            </IconButtonV2>
          </Tooltip>
        </ControlButtonsWrapper>
      )}
      {showJumpToResources && (
        <StyledResourceButton
          variant="outline"
          disabled={resourcesLoading}
          onClick={() => jumpToResources?.()}
        >
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
