/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing, fonts, breakpoints } from '@ndla/core';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import SettingsMenu from './SettingsMenu';
import { Row } from '../../../components';
import Spinner from '../../../components/Spinner';

const StyledResourceButton = styled(Button)`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

const StyledFolderWrapper = styled.div`
  display: flex;
`;

interface Props {
  node: NodeType;
  structure: NodeType[];
  isMainActive?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node: NodeType) => void;
  nodeChildren: NodeType[];
  jumpToResources?: () => void;
  resourcesLoading?: boolean;
}

const FolderItem = ({
  node,
  isMainActive,
  rootNodeId,
  structure,
  onCurrentNodeChanged,
  nodeChildren,
  jumpToResources,
  resourcesLoading,
}: Props) => {
  const showJumpToResources = isMainActive && node.id.includes('topic');
  const { t } = useTranslation();

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
          outline
          type="button"
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
