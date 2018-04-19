/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';

const tagClasses = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

class SearchTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag,
    };
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(e) {
    const { onRemoveItem, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem(tag);
    }
  }

  render() {
    const { tag } = this.state;

    return (
      <div {...tagClasses()}>
        <div {...tagClasses('description')}>{tag.name}</div>
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </div>
    );
  }
}

SearchTag.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onRemoveItem: PropTypes.func,
};

export default SearchTag;
