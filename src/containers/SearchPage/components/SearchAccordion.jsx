/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

import { Button } from 'ndla-ui';
import { ExpandLess, ExpandMore } from 'ndla-icons/action';
import { Search } from 'ndla-icons/common';

const classes = new BEMHelper({
  name: 'search-accordion',
  prefix: 'c-',
});

const SearchAccordion = ({
  header,
  hidden,
  handleToggle,
  className,
  ...rest
}) => {
  const contentModifiers = {
    hidden,
    visible: !hidden,
  };

  return (
    <div {...classes('')} {...rest}>
      <Button {...classes('button')} stripped onClick={handleToggle}>
        <span {...classes('title')}>
          <Search className="c-icon--medium" />
          {header}
        </span>
        {hidden ? (
          <ExpandMore {...classes('arrow')} />
        ) : (
          <ExpandLess {...classes('arrow')} />
        )}
      </Button>
      <div {...classes('content', contentModifiers)}>{rest.children}</div>
    </div>
  );
};

SearchAccordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  header: PropTypes.string,
  hidden: PropTypes.bool,
  handleToggle: PropTypes.func,
};

export default SearchAccordion;
