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
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing, fonts } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { classes } from './ResourceGroup';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import GrepCodesModal from '../../GrepCodes/GrepCodesModal';
import RemoveButton from '../../../components/RemoveButton';
import ResourceItemLink from './ResourceItemLink';
import RelevanceOption from '../folderComponents/menuOptions/RelevanceOption';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';

import { StructureShape, ResourceShape } from '../../../shapes';

const StyledCheckIcon = styled(Check)`
  height: 24px;
  width: 24px;
  fill: ${colors.support.green};
`;

const StyledGrepText = styled.small`
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes(14, 1)};
`;

const statusButtonStyle = css`
  margin-right: ${spacing.xsmall};
`;

const grepButtonStyle = css`
  margin-left: ${spacing.xsmall};
`;

const Resource = ({
  resource,
  structure,
  onDelete,
  connectionId,
  dragHandleProps,
  locale,
  relevanceId,
  updateRelevanceId,
  primary,
  rank,
  t,
}) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showGrepCodes, setShowGrepCodes] = useState(false);

  const contentType = resource.resourceTypes
    ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
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
      <Button stripped css={grepButtonStyle} onClick={() => setShowGrepCodes(true)}>
        <StyledGrepText>GREP</StyledGrepText>
      </Button>
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
      {showGrepCodes && (
        <GrepCodesModal
          onClose={() => setShowGrepCodes(false)}
          contentUri={resource.contentUri}
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
  resource: ResourceShape.isRequired,
  onDelete: PropTypes.func,
  currentTopic: PropTypes.shape({}),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  structure: PropTypes.arrayOf(StructureShape),
  connectionId: PropTypes.string,
  resourceId: PropTypes.string,
  dragHandleProps: PropTypes.object,
  locale: PropTypes.string.isRequired,
  relevanceId: PropTypes.oneOf([
    'urn:relevance:core',
    'urn:relevance:supplementary',
    null,
    undefined,
  ]),
  updateRelevanceId: PropTypes.func,
  primary: PropTypes.bool,
  rank: PropTypes.number,
};

export default injectT(Resource);
