/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Filter } from '@ndla/icons/editor';
import { RemoveCircle } from '@ndla/icons/action';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { classes } from './ResourceGroup';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import FilterConnections from '../../../components/Taxonomy/filter/FilterConnections';
import ResourceItemLink from './ResourceItemLink';
import { PUBLISHED } from '../../../util/constants/ArticleStatus';

const filterButtonStyle = css`
  padding: 0 10px;
  margin: 0 20px;
`;

const PublishIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: green;
  line-height: 1.625;
`;

const Resource = ({
  contentType,
  name,
  showFilterPicker,
  toggleFilterPicker,
  onFilterChange,
  activeFilters,
  currentTopic,
  currentSubject,
  onFilterSubmit,
  onDelete,
  id,
  connectionId,
  dragHandleProps,
  contentUri,
  status,
  locale,
  t,
}) => {
  // because topic-article icon is wrongly named "subject" in frontend-packages:
  const iconType = contentType === 'topic-article' ? 'subject' : contentType;

  return (
    <div
      data-testid={`resource-type-${contentType}`}
      {...classes('text o-flag o-flag--top')}>
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
        />
      </div>
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
            topics={[currentTopic]}
            activeFilters={activeFilters}
            resourceId={id}
            structure={[currentSubject]}
            availableFilters={{ [currentSubject.id]: currentTopic.filters }}
            updateFilter={onFilterChange}
          />
          <Button onClick={() => onFilterSubmit(id)}>{t('form.save')}</Button>
        </TaxonomyLightbox>
      )}
      {status === PUBLISHED && <PublishIndicator />}
      {onDelete && (
        <Button onClick={() => onDelete(connectionId)} stripped>
          <RemoveCircle {...classes('deleteIcon')} />
        </Button>
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
  activeFilters: PropTypes.arrayOf(PropTypes.object),
  currentTopic: PropTypes.shape({
    filters: PropTypes.array,
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onFilterSubmit: PropTypes.func,
  id: PropTypes.string,
  connectionId: PropTypes.string,
  resourceId: PropTypes.string,
  dragHandleProps: PropTypes.object,
  contentUri: PropTypes.string,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
};

export default injectT(Resource);
