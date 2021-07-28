/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
//@ts-ignore
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import RemoveButton from '../../../components/RemoveButton';
import ResourceItemLink from './ResourceItemLink';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import { Resource as ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatus } from '../../../modules/draft/draftApiInterfaces';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

interface Props {
  resource: ResourceType & { status?: DraftStatus };
  onDelete?: (connectionId: string) => void;
  connectionId: string;
  dragHandleProps?: object;
  locale: string;
  relevanceId?: string;
  updateRelevanceId?: (
    connectionId: string,
    body: { primary?: boolean; rank?: number; relevanceId?: string },
  ) => Promise<void>;
  primary?: boolean;
  rank?: number;
}

const Resource = ({
  resource,
  onDelete,
  connectionId,
  dragHandleProps = {},
  locale,
  relevanceId,
  updateRelevanceId,
  primary,
  rank,
  t,
}: Props & tType) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes.map(r => ({ ...r, subtypes: [] })))
          .contentType
      : 'topic-article';

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  return (
    <div data-testid={`resource-type-${contentType}`} {...classes('text o-flag o-flag--top')}>
      {contentType && (
        <div key="img" {...classes('icon o-flag__img')} {...dragHandleProps}>
          <ContentTypeBadge background type={iconType} />
        </div>
      )}
      <div key="body" {...classes('body o-flag__body')}>
        <ResourceItemLink
          contentType={contentType}
          contentUri={resource.contentUri}
          locale={locale}
          name={resource.name}
          isVisible={resource.metadata?.visible}
        />
      </div>
      {resource.status?.current && (
        <Button
          lighter
          css={statusButtonStyle}
          onClick={() => setShowVersionHistory(true)}
          disabled={contentType === 'learning-path'}>
          {t(`form.status.${resource.status.current.toLowerCase()}`)}
        </Button>
      )}
      {(resource.status?.current === PUBLISHED || resource.status?.other?.includes(PUBLISHED)) && (
        <Tooltip tooltip={t('form.workflow.published')}>
          <StyledCheckIcon />
        </Tooltip>
      )}
      <RelevanceOption
        relevanceId={relevanceId}
        onChange={relevanceIdUpdate =>
          updateRelevanceId
            ? updateRelevanceId(connectionId, {
                relevanceId: relevanceIdUpdate,
                primary,
                rank,
              })
            : null
        }
      />

      {onDelete && <RemoveButton onClick={() => onDelete(connectionId)} />}
      {showVersionHistory && (
        <VersionHistoryLightbox
          onClose={() => setShowVersionHistory(false)}
          contentUri={resource.contentUri}
          contentType={contentType}
          name={resource.name}
          isVisible={resource.metadata?.visible}
          locale={locale}
        />
      )}
    </div>
  );
};

export default injectT(Resource);
