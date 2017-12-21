/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import { dropDownClasses } from './DropDown';

class DropdownTag extends Component {
  constructor(props) {
    super(props);

    this.state = { tag: props.tag };
    this.onRemove = this.onRemove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tag !== this.props.tag) {
      this.setState({ tag: nextProps.tag });
    }
  }

  onRemove(e) {
    const { onRemoveItem, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem({ ...tag });
    }
  }

  render() {
    const { tag } = this.state;

    return (
      <div {...dropDownClasses('tag')}>
        {tag.name}{' '}
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </div>
    );
  }
}

DropdownTag.propTypes = {
  tag: PropTypes.shape({}).isRequired,
  onRemoveItem: PropTypes.func,
};

export default DropdownTag;
