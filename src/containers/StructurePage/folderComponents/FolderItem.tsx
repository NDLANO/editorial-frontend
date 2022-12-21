/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import SettingsMenu from './SettingsMenu';

const StyledResourceButton = styled(Button)`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

const StyledFolderWrapper = styled.div`
  display: flex;
  width: 100%;
`;

interface Props {
  node: NodeType;
  structure: NodeType[];
  isMainActive?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node: NodeType) => void;
  nodeChildren: NodeType[];
}

const FolderItem = ({
  node,
  isMainActive,
  rootNodeId,
  structure,
  onCurrentNodeChanged,
  nodeChildren,
}: Props) => {
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
    </StyledFolderWrapper>
  );
};

export default FolderItem;
