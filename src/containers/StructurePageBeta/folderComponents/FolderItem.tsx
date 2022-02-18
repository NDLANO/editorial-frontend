/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import BEMHelper from 'react-bem-helper';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import { Row } from '../../../components';
import Spinner from '../../../components/Spinner';
import SettingsMenu from './SettingsMenu';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const resourceButtonStyle = css`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

interface Props {
  node: NodeType;
  structure: NodeType[];
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
}

const FolderItem = ({
  node,
  jumpToResources,
  isMainActive,
  resourcesLoading,
  rootNodeId,
  structure,
}: Props) => {
  const { t } = useTranslation();
  const showJumpToResources = isMainActive && node.id.includes('topic');

  return (
    <div data-cy="folderWrapper" {...classes('wrapper')}>
      {isMainActive && <SettingsMenu node={node} rootNodeId={rootNodeId} structure={structure} />}
      {showJumpToResources && (
        <Button
          outline
          css={resourceButtonStyle}
          type="button"
          disabled={resourcesLoading}
          onClick={() => jumpToResources?.()}>
          <Row>
            {t('taxonomy.jumpToResources')}
            {!!resourcesLoading && <Spinner appearance="small" />}
          </Row>
        </Button>
      )}
    </div>
  );
};

export default FolderItem;
