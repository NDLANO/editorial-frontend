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
// @ts-ignore
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import ResourceItemLink from './ResourceItemLink';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import RemoveButton from '../../../components/RemoveButton';
import { Status, TaxonomyMetadata } from '../../../interfaces';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

const Resource = ({
  contentType,
  name,
  onDelete,
  connectionId,
  dragHandleProps = {},
  contentUri,
  status,
  metadata,
  locale,
  relevanceId,
  updateRelevanceId,
  primary,
  rank,
  t,
}: Props & tType) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
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
          contentUri={contentUri}
          locale={locale}
          name={name}
          isVisible={metadata.visible}
        />
      </div>
      {status?.current && (
        <Button
          lighter
          css={statusButtonStyle}
          onClick={() => setShowVersionHistory(true)}
          disabled={contentType === 'learning-path'}>
          {t(`form.status.${status.current.toLowerCase()}`)}
        </Button>
      )}
      {(status?.current === PUBLISHED || status?.other?.includes(PUBLISHED)) && (
        <Tooltip tooltip={t('form.workflow.published')}>
          <StyledCheckIcon />
        </Tooltip>
      )}
      {updateRelevanceId && (
        <RelevanceOption
          relevanceId={relevanceId}
          onChange={relevanceIdUpdate =>
            updateRelevanceId(connectionId, {
              relevanceId: relevanceIdUpdate,
              primary,
              rank,
            })
          }
        />
      )}
      {onDelete && <RemoveButton onClick={() => onDelete(connectionId)} />}
      {showVersionHistory && (
        <VersionHistoryLightbox
          onClose={() => setShowVersionHistory(false)}
          contentUri={contentUri}
          contentType={contentType}
          name={name}
          isVisible={metadata.visible}
          locale={locale}
        />
      )}
    </div>
  );
};

interface Props {
  contentType: string;
  name: string;
  onDelete?: (id: string) => void;
  refreshResources: Function;
  connectionId: string;
  dragHandleProps?: object;
  contentUri?: string;
  status?: Status;
  metadata: TaxonomyMetadata;
  locale: string;
  relevanceId: string;
  updateRelevanceId?: (connectionId: string, body: any) => void;
  primary: boolean;
  rank: number;
}

export default injectT(Resource);
