/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import SearchContentForm from './SearchContentForm';
import SearchMediaForm from './SearchMediaForm';
import SearchConceptForm from './SearchConceptForm';
import SearchAgreementForm from './SearchAgreementForm';

export const searchFormClasses = new BEMHelper({
  name: 'search-form',
  prefix: 'c-',
});

const SearchForm = ({ type, searchObject, ...rest }) => {
  switch (type) {
    case 'content':
      return <SearchContentForm searchObject={searchObject} {...rest} />;
    case 'media':
      return <SearchMediaForm searchObject={searchObject} {...rest} />;
    case 'concept':
      return <SearchConceptForm searchObject={searchObject} {...rest} />;
    case 'agreement':
      return <SearchAgreementForm searchObject={searchObject} {...rest} />;
    default:
      return <p>{`This type: ${type} is not supported`}</p>;
  }
};

SearchForm.propTypes = {
  type: PropTypes.string.isRequired,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    subjects: PropTypes.string,
    'resource-types': PropTypes.string,
    'draft-status': PropTypes.string,
    users: PropTypes.string,
  }),
};

export default SearchForm;
