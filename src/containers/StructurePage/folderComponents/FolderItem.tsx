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
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { css } from '@emotion/core';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';

import Spinner from '../../../components/Spinner';
import { Row } from '../../../components';
import { NodeType } from '../../../modules/taxonomy/nodes/nodeApiTypes';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const resourceButtonStyle = css`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

interface BaseProps {
  node: NodeType;
  structure: NodeType[];
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
}

type Props = BaseProps & RouteComponentProps;

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
          onClick={() => {
            jumpToResources!();
          }}>
          <Row>
            {t('taxonomy.jumpToResources')}
            {!!resourcesLoading && <Spinner appearance="small" />}
          </Row>
        </Button>
      )}
    </div>
  );
};

export default withRouter(FolderItem);
