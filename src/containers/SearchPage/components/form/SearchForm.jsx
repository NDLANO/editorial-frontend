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

export const searchFormClasses = new BEMHelper({
  name: 'search-form',
  prefix: 'c-',
});

const SearchForm = ({ type, ...rest }) => {
  switch (type) {
    case 'content':
      return <SearchContentForm {...rest} />;
    case 'media':
      return <SearchMediaForm {...rest} />;
    default:
      return <p>{`This type: ${type} is not supported`}</p>;
  }
};

SearchForm.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SearchForm;
