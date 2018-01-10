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
import ToolTip from '../../ToolTip';
import { dropDownClasses } from './dropDownClasses';

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
      tagProperty: '',
    };
    this.onRemove = this.onRemove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleSetTagProperty = this.handleSetTagProperty.bind(this);
    this.toggleHighligth = this.toggleHighligth.bind(this);
  }

  componentWillMount() {
    const { name } = this.props;

    if (name === 'filter') {
      this.setState({ tagProperty: 'K' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tag !== this.props.tag) {
      this.setState({ tag: nextProps.tag });
    }
    if (this.props.name) {
      if (nextProps.primaryTopic !== this.props.primaryTopic) {
        if (nextProps.primaryTopic === this.props.tag) {
          this.setState({ isHighlighted: false });
        }
      }
    }
  }

  onClick() {
    const { tag } = this.state;
    const { name, primaryTopic } = this.props;

    if (name === 'topics' && primaryTopic !== tag) {
      this.toggleHighligth();
    }
  }

  onRemove(e) {
    const { onRemoveItem, name, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem(tag, 'selectedItems', name);
    }
  }

  handleSetTagProperty(e) {
    const { handlePopupClick } = this.props;
    const { value } = e.target;
    this.setState({ tagProperty: value });
    handlePopupClick(this.state.tag, 'filter', value);
  }

  toggleHighligth() {
    this.setState(prevState => ({
      isHighlighted: !prevState.isHighlighted,
    }));
  }

  render() {
    const { tag, tagProperty, isHighlighted } = this.state;
    const { name, primaryTopic } = this.props;

    const tagPropertyItem = (
      <div {...classes()}>
        <strong>{primaryTopic === tag ? 'P' : tagProperty}</strong>
      </div>
    );

    const filterTooltipItem = (
      <div {...classes('radio')} tabIndex={-1} role="radiogroup">
        <div {...classes('radio', 'description')}>Velg relevans</div>
        <label {...classes('radio', 'label')} htmlFor="kjernestoff">
          <input
            type="radio"
            value="K"
            onChange={e => this.handleSetTagProperty(e)}
            checked={tagProperty === 'K'}
          />
          Kjernestoff
        </label>
        <label {...classes('radio', 'label')} htmlFor="kjernestoff">
          <input
            type="radio"
            value="T"
            onChange={e => this.handleSetTagProperty(e)}
            checked={tagProperty === 'T'}
          />
          Tilleggsstoff
        </label>
      </div>
    );

    const filterItem = (
      <ToolTip
        name={name}
        direction="right"
        messages={{ ariaLabel: 'tooltip' }}
        content={filterTooltipItem}>
        {tagPropertyItem}
      </ToolTip>
    );

    let tagItem;
    if (primaryTopic === tag && name) {
      tagItem = tagPropertyItem;
    } else if (tagProperty && name === 'filter') {
      tagItem = filterItem;
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
  primaryTopic: PropTypes.shape({}).isRequired,
  handlePopupClick: PropTypes.func,
  onRemoveItem: PropTypes.func,
};

export default DropdownTag;
