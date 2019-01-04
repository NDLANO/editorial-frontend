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
import { Filter } from '@ndla/icons/editor';
import { RemoveCircle } from '@ndla/icons/action';
import { ContentTypeBadge } from '@ndla/ui';
import Button from '@ndla/button';
import { classes } from './ResourceGroup';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import FilterConnections from '../../../components/Taxonomy/FilterConnections';
// import { RESOURCE_FILTER_CORE } from '../../../constants';

const Resource = ({
  contentType,
  name,
  showFilterPicker,
  toggleFilterPicker,
  onFilterChange,
  activeFilters = [],
  currentTopic,
  currentSubject,
  onFilterSubmit,
  onDelete,
  id,
  t,
}) => (
  <div
    data-testid={`resource-type-${contentType}`}
    {...classes('text o-flag o-flag--top')}>
    {contentType && (
      <div key="img" {...classes('icon o-flag__img')}>
        <ContentTypeBadge background type={contentType} />
      </div>
    )}
    <div key="body" {...classes('body o-flag__body')}>
      <h1 {...classes('title')}>{name}</h1>
    </div>
    {contentType !== 'subject' && (
      <Button
        stripped
        onClick={toggleFilterPicker}
        {...classes('filterButton')}>
        <Filter {...classes('filterIcon')} />
      </Button>
    )}
    {showFilterPicker && (
      <TaxonomyLightbox
        display
        big
        title={t('taxonomy.resource.chooseFilter')}
        onClose={toggleFilterPicker}
        whiteContent>
        <FilterConnections
          topics={[currentTopic]}
          filter={activeFilters}
          structure={[currentSubject]}
          availableFilters={{ [currentSubject.id]: currentTopic.filters }}
          updateFilter={onFilterChange}
        />
        <Button onClick={onFilterSubmit}>{t('form.save')}</Button>
      </TaxonomyLightbox>
    )}

    {onDelete && (
      <Button onClick={onDelete} stripped>
        <RemoveCircle {...classes('deleteIcon')} />
      </Button>
    )}
  </div>
);

Resource.propTypes = {
  contentType: PropTypes.string.isRequired,
  name: PropTypes.string,
  onDelete: PropTypes.func,
  showFilterPicker: PropTypes.bool,
  toggleFilterPicker: PropTypes.func,
  onFilterChange: PropTypes.func,
  activeFilters: PropTypes.arrayOf(PropTypes.object),
  currentTopic: PropTypes.shape({
    filter: PropTypes.array,
  }),
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onFilterSubmit: PropTypes.func,
  id: PropTypes.string,
};

export default injectT(Resource);
