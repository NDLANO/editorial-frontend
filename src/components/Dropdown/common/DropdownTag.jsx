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

const RESOURCE_FILTER_CORE = {
  id: 'urn:relevance:core',
  name: 'Kjernestoff',
};
const RESOURCE_FILTER_SUPPLEMENTARY = {
  id: 'urn:relevance:supplementary',
  name: 'Tilleggsstoff',
};

const RESOURCE_TOPICS_PRIMARY = { name: 'Primærkobling' };

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
      tagProperty: {},
    };
    this.onRemove = this.onRemove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleSetTagProperty = this.handleSetTagProperty.bind(this);
    this.toggleHighligth = this.toggleHighligth.bind(this);
  }

  componentWillMount() {
    const { name, tag } = this.props;

    if (name === 'filter') {
      if (tag.relevanceId === RESOURCE_FILTER_CORE.id) {
        this.setState({
          tagProperty: RESOURCE_FILTER_CORE,
        });
      } else if (tag.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY.id) {
        this.setState({
          tagProperty: RESOURCE_FILTER_SUPPLEMENTARY,
        });
      }
    }
    if (name === 'topics') {
      if (tag.primary) {
        this.setState({
          tagProperty: RESOURCE_TOPICS_PRIMARY,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tag !== this.props.tag) {
      this.setState({ tag: nextProps.tag });
    }
    if (nextProps.tag.primary !== this.props.tag.primary) {
      if (nextProps.tag.primary) {
        this.setState({
          tagProperty: RESOURCE_TOPICS_PRIMARY,
          isHighlighted: false,
        });
      }
    }
  }

  onClick() {
    const { tag } = this.state;
    const { name } = this.props;

    if (name === 'topics' && !tag.primary) {
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

  handleSetTagProperty(e) {
    const { handlePopupClick, tagProperties } = this.props;
    const { value } = e.target;

    let newTag;
    tagProperties.forEach(item => {
      if (item.id === value) {
        this.setState({ tagProperty: item });
        newTag = {
          ...this.state.tag,
          relevanceId: item.id,
        };
      }
    });

    handlePopupClick(newTag);
  }

  toggleHighligth() {
    this.setState(prevState => ({
      isHighlighted: !prevState.isHighlighted,
    }));
  }

  render() {
    const { tag, tagProperty, isHighlighted } = this.state;
    const { messages, name, tagProperties } = this.props;

    let tagRelevances;
    if (tagProperties) {
      tagRelevances = tagProperties.map(
        property =>
          property.name ? (
            <label
              key={property.id}
              {...classes('radio', 'label')}
              htmlFor={property.name.toLowerCase()}>
              <input
                type="radio"
                value={property.id}
                onChange={e => this.handleSetTagProperty(e)}
                checked={tagProperty.id === property.id}
              />
              {property.name}
            </label>
          ) : (
            ''
          ),
      );
    }
    const tagShortName = tagProperty.name
      ? tagProperty.name.charAt(0).toUpperCase()
      : '';

    const tagPropertyItem = (
      <div {...classes()}>
        <strong>{tagShortName}</strong>
      </div>
    );

    const filterTooltipItem = (
      <div {...classes('radio')} tabIndex={-1} role="radiogroup">
        <div {...classes('radio', 'description')}>
          {messages.toolTipDescription}
        </div>
        {tagRelevances}
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
    if (tag.primary) {
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
  tag: PropTypes.shape({
    primary: PropTypes.bool,
  }).isRequired,
  tagProperties: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.string.isRequired,
  handlePopupClick: PropTypes.func,
  onRemoveItem: PropTypes.func,
  messages: PropTypes.shape({}),
};

export { RESOURCE_FILTER_CORE, RESOURCE_TOPICS_PRIMARY, DropdownTag };
