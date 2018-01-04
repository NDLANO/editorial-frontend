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
import BEMHelper from 'react-bem-helper';
import { dropDownClasses } from './DropDown';

const classes = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

class DropdownTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: props.tag,
      isHighlighted: false,
    };
    this.onRemove = this.onRemove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleHighligth = this.toggleHighligth.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tag !== this.props.tag) {
      this.setState({ tag: nextProps.tag });
    }
    if (this.props.name === 'resourceTypes') {
      if (nextProps.primaryResourceType !== this.props.primaryResourceType) {
        if (nextProps.primaryResourceType === this.props.tag) {
          this.setState({ isHighlighted: false });
        }
      }
    }
  }

  onClick() {
    const { tag } = this.state;
    const { name, primaryResourceType } = this.props;

    if (name === 'resourceTypes' && primaryResourceType !== tag) {
      this.toggleHighligth();
    }
  }

  onRemove(e) {
    const { onRemoveItem, name, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem(tag, name);
    }
  }

  toggleHighligth() {
    this.setState(prevState => ({
      isHighlighted: !prevState.isHighlighted,
    }));
  }

  render() {
    const { tag, isHighlighted } = this.state;
    const { primaryResourceType } = this.props;

    let tagItem;
    if (primaryResourceType === tag) {
      tagItem = (
        <div {...classes()}>
          <strong>P</strong>
        </div>
      );
    }

    return (
      // eslint-disable-next-line
      <div
        onClick={this.onClick}
        {...dropDownClasses('tag', isHighlighted ? 'highlighted' : '')}>
        <div {...classes('description')}>{tag.name}</div>
        {tagItem && <div {...classes('item')}>{tagItem}</div>}
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </div>
    );
  }
}

DropdownTag.propTypes = {
  tag: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  primaryResourceType: PropTypes.shape({}).isRequired,
  setPrimaryResourceType: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func,
};

export default DropdownTag;
