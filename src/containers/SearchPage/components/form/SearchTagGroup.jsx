/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SearchTag from './SearchTag';
import { ResourceTypeShape } from '../../../../shapes';

const SearchTagGroup = ({
  subjects,
  resourceTypes,
  model,
  languages,
  t,
  onRemoveItem,
}) => (
  <Fragment>
    {model.query && (
      <SearchTag
        onRemoveItem={onRemoveItem}
        tag={{ type: 'query', id: model.query, name: model.query }}
      />
    )}
    {model.language && (
      <SearchTag
        onRemoveItem={onRemoveItem}
        tag={{
          type: 'language',
          id: model.language,
          name: languages(t).find(language => language.id === model.language)
            .name,
        }}
      />
    )}
    {model.subjects &&
      subjects.length > 0 && (
        <SearchTag
          onRemoveItem={onRemoveItem}
          tag={{
            type: 'subjects',
            id: model.subjects,
            name: subjects.find(subject => subject.id === model.subjects).name,
          }}
        />
      )}
    {model.resourceTypes &&
      resourceTypes.length > 0 && (
        <SearchTag
          onRemoveItem={onRemoveItem}
          tag={{
            type: 'resourceTypes',
            id: model.resourceTypes,
            name: resourceTypes.find(
              resourceType => resourceType.id === model.resourceTypes,
            ).name,
          }}
        />
      )}
    )
  </Fragment>
);

SearchTagGroup.propTypes = {
  onRemoveItem: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(PropTypes.shape({})),
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  languages: PropTypes.func,
  model: PropTypes.shape({
    id: PropTypes.number,
    query: PropTypes.string,
    language: PropTypes.string,
    subjects: PropTypes.string,
    resourceTypes: PropTypes.string,
  }),
};

export default SearchTagGroup;
