/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
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
import { fetchResourceFilter } from '../../../modules/taxonomy';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import VersionHistoryLightbox from '../../../components/VersionHistoryLightbox';
import FilterConnections from '../../../components/Taxonomy/filter/FilterConnections';
import ResourceItemLink from './ResourceItemLink';
import { getContentTypeFromResourceTypes } from '../../../util/resourceHelpers';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';
import handleError from '../../../util/handleError';
import { StructureShape, AvailableFiltersShape, ResourceShape } from '../../../shapes';

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
  resource,
  availableFilters,
  structure,
  onFilterSubmit,
  onDelete,
  dragHandleProps,
  locale,
  t,
}) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const contentType = resource.resourceTypes
    ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
    : 'topic-article';

  useEffect(() => {
    if (contentType !== 'topic-article') {
      fetchResourceFilter(resource.id, locale)
        .then(filters => setActiveFilters(filters))
        .catch(e => handleError(e));
    }
  }, []);

  const iconType = contentType === 'topic-article' ? 'topic' : contentType;

  const onFilterChange = (resourceId, filterToUpdate, relevanceId, remove) => {
    setActiveFilters(currentFilters => {
      const newFilters = currentFilters.filter(filter => filter.id !== filterToUpdate.id);
      if (!remove) {
        newFilters.push({ ...filterToUpdate, relevanceId });
      }
      return newFilters;
    });
  };

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
      {contentType !== 'topic-article' && (
        <Button
          stripped
          onClick={() => setShowFilterPicker(true)}
          data-testid={`openFilterPicker-${resource.id}`}
          css={filterButtonStyle}>
          <Filter {...classes('filterIcon')} />
        </Button>
      )}
      {showFilterPicker && (
        <TaxonomyLightbox
          display
          big
          title={t('taxonomy.resource.chooseFilter')}
          onClose={() => setShowFilterPicker(false)}>
          <FilterConnections
            breadCrumbs={resource.breadCrumbs}
            activeFilters={activeFilters}
            resourceId={resource.id}
            structure={structure}
            availableFilters={availableFilters}
            updateFilter={onFilterChange}
          />
          <Button onClick={() => onFilterSubmit(resource.id, activeFilters)}>
            {t('form.save')}
          </Button>
        </TaxonomyLightbox>
      )}
      {onDelete && (
        <Button onClick={() => onDelete(resource.connectionId, resource.id)} stripped>
          <RemoveCircle {...classes('deleteIcon')} />
        </Button>
      )}
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

Resource.defaultProps = {
  activeFilters: [],
  dragHandleProps: {},
};

Resource.propTypes = {
  resource: ResourceShape.isRequired,
  contentType: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  availableFilters: AvailableFiltersShape,
  currentTopic: PropTypes.shape({
    filters: PropTypes.array,
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  structure: PropTypes.arrayOf(StructureShape),
  onFilterSubmit: PropTypes.func,
  resourceId: PropTypes.string,
  dragHandleProps: PropTypes.object,
  locale: PropTypes.string.isRequired,
};

export default injectT(Resource);
