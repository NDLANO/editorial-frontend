/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { RemoveCircle } from '@ndla/icons/action';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import ResourceItemLink from './ResourceItemLink';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import { MetadataShape } from '../../../shapes';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import { StructureContext } from '../StructureContainer';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

const deleteButtonStyle = css`
  line-height: 1;
  margin-left: ${spacing.xsmall};
`;

const Resource = ({
  contentType,
  name,
  onDelete,
  connectionId,
  dragHandleProps,
  contentUri,
  status,
  metadata,
  locale,
  relevanceId,
  primary,
  refreshResources,
  rank,
  t,
}) => {
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
          isVisible={metadata?.visible}
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
      <StructureContext.Consumer>
        {updateRelevanceId => (
          <RelevanceOption
            relevanceId={relevanceId}
            isPrimary={primary}
            connectionId={connectionId}
            onChange={updateRelevanceId}
            refreshResources={refreshResources}
            rank={rank}
          />
        )}
      </StructureContext.Consumer>
      {onDelete && (
        <Button css={deleteButtonStyle} onClick={() => onDelete(connectionId)} stripped>
          <RemoveCircle {...classes('deleteIcon')} />
        </Button>
      )}
      {showVersionHistory && (
        <VersionHistoryLightbox
          onClose={() => setShowVersionHistory(false)}
          contentUri={contentUri}
          contentType={contentType}
          name={name}
          isVisible={metadata?.visible}
          locale={locale}
        />
      )}
    </div>
  );
};

Resource.defaultProps = {
  dragHandleProps: {},
};

Resource.propTypes = {
  contentType: PropTypes.string.isRequired,
  name: PropTypes.string,
  onDelete: PropTypes.func,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  connectionId: PropTypes.string,
  resourceId: PropTypes.string,
  dragHandleProps: PropTypes.object,
  contentUri: PropTypes.string,
  status: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  metadata: MetadataShape,
  locale: PropTypes.string.isRequired,
  relevanceId: PropTypes.oneOf([
    'urn:relevance:core',
    'urn:relevance:supplementary',
    null,
    undefined,
  ]),
  primary: PropTypes.bool,
  rank: PropTypes.number,
  refreshResources: PropTypes.func,
};

export default injectT(Resource);
