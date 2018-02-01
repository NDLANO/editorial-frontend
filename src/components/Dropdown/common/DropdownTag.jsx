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
import { injectT } from 'ndla-i18n';
import DropdownTagPropertyItem from './DropdownTagPropertyItem';
import ToolTip from '../../ToolTip';
import { dropDownClasses } from './dropDownClasses';

export const tagClasses = new BEMHelper({
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
    const { t, name, tag } = this.props;

    if (name === 'topics') {
      this.setState({
        tagProperty: tag.primary
          ? {
              name: t('form.topics.primaryTopic'),
            }
          : {},
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { name, tag, tagProperties, t } = this.props;

    if (nextProps.tag !== tag) {
      this.setState({ tag: nextProps.tag });
    }
    if (nextProps.tagProperties !== tagProperties) {
      if (name === 'filter') {
        this.setState({
          tagProperty: {
            id: tag.relevanceId,
            name: nextProps.tagProperties.find(
              item => item.id === tag.relevanceId,
            ).name,
          },
        });
      }
    }
    if (nextProps.tag.primary !== tag.primary) {
      if (nextProps.tag.primary) {
        this.setState({
          tagProperty: { name: t('form.topics.primaryTopic') },
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
            <DropdownTagPropertyItem
              key={property.id}
              itemProperty={tagProperty}
              tagProperty={property}
              handleSetTagProperty={this.handleSetTagProperty}
            />
          ) : (
            ''
          ),
      );
    }
    const tagShortName = tagProperty.name
      ? tagProperty.name.charAt(0).toUpperCase()
      : '';

    const tagPropertyItem = (
      <div {...tagClasses()}>
        <strong>{tagShortName}</strong>
      </div>
    );

    const filterTooltipItem = (
      <div {...tagClasses('radio')} tabIndex={-1} role="radiogroup">
        <div {...tagClasses('radio', 'description')}>
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
        <div {...tagClasses('description')}>{tag.name}</div>
        {tagItem && <div {...tagClasses('item')}>{tagItem}</div>}
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
  }),
  tagProperties: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.string,
  handlePopupClick: PropTypes.func,
  onRemoveItem: PropTypes.func,
  messages: PropTypes.shape({}),
};

export default injectT(DropdownTag);
