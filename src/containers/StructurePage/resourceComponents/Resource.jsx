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
import { Filter } from '@ndla/icons/editor';
import { RemoveCircle } from '@ndla/icons/action';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { classes } from './ResourceGroup';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import FilterConnections from '../../../components/Taxonomy/filter/FilterConnections';
import ResourceItemLink from './ResourceItemLink';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import { StructureShape, AvailableFiltersShape, TopicShape, MetadataShape } from '../../../shapes';

const filterButtonStyle = css`
  padding: 0 10px;
  margin: 0 20px;
`;

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
  showFilterPicker,
  toggleFilterPicker,
  onFilterChange,
  availableFilters,
  activeFilters,
  breadCrumbs,
  structure,
  onFilterSubmit,
  onDelete,
  id,
  connectionId,
  dragHandleProps,
  contentUri,
  status,
  metadata,
  locale,
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
      {contentType !== 'topic-article' && (
        <Button
          stripped
          onClick={() => toggleFilterPicker(id)}
          data-testid={`openFilterPicker-${id}`}
          css={filterButtonStyle}>
          <Filter {...classes('filterIcon')} />
        </Button>
      )}
      {showFilterPicker && (
        <TaxonomyLightbox
          display
          big
          title={t('taxonomy.resource.chooseFilter')}
          onClose={() => toggleFilterPicker(id)}>
          <FilterConnections
            breadCrumbs={breadCrumbs}
            activeFilters={activeFilters}
            resourceId={id}
            structure={structure}
            availableFilters={availableFilters}
            updateFilter={onFilterChange}
          />
          <Button onClick={() => onFilterSubmit(id)}>{t('form.save')}</Button>
        </TaxonomyLightbox>
      )}
      {onDelete && (
        <Button onClick={() => onDelete(connectionId, id)} stripped>
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
  activeFilters: [],
  dragHandleProps: {},
};

Resource.propTypes = {
  contentType: PropTypes.string.isRequired,
  name: PropTypes.string,
  onDelete: PropTypes.func,
  showFilterPicker: PropTypes.bool,
  toggleFilterPicker: PropTypes.func,
  onFilterChange: PropTypes.func,
  availableFilters: AvailableFiltersShape,
  activeFilters: PropTypes.arrayOf(PropTypes.object),
  currentTopic: PropTypes.shape({
    filters: PropTypes.array,
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  structure: PropTypes.arrayOf(StructureShape),
  onFilterSubmit: PropTypes.func,
  id: PropTypes.string,
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
  breadCrumbs: PropTypes.arrayOf(PropTypes.arrayOf(TopicShape)),
};

export default injectT(Resource);
