/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing, fonts, mq, breakpoints } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
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
  width: 100%;
  align-items: center;
`;

interface Props {
  node: NodeType;
  structure: NodeType[];
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node: NodeType) => void;
  nodeChildren: NodeType[];
}

const FolderItem = ({
  node,
  jumpToResources,
  isMainActive,
  resourcesLoading,
  rootNodeId,
  structure,
  onCurrentNodeChanged,
  nodeChildren,
}: Props) => {
  const { t } = useTranslation();
  const showJumpToResources = isMainActive && node.id.includes('topic');

  return (
    <StyledFolderWrapper data-cy="folderWrapper">
      {isMainActive && (
        <SettingsMenu
          node={node}
          rootNodeId={rootNodeId}
          structure={structure}
          onCurrentNodeChanged={onCurrentNodeChanged}
          nodeChildren={nodeChildren}
        />
      )}
      {showJumpToResources && (
        <StyledResourceButton
          variant="outline"
          disabled={resourcesLoading}
          onClick={() => jumpToResources?.()}>
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
