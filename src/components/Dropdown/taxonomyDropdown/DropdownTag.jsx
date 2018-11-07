/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';

import { tagClasses } from '../../Tag';
import FilterRelevanceSelector from './FilterRelevanceSelector';

class DropdownTag extends Component {
  constructor(props) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
    this.handleSetTagProperty = this.handleSetTagProperty.bind(this);
  }

  onRemove(e) {
    const { onRemoveItem, name, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem(tag, name);
    }
  }

  handleSetTagProperty(id) {
    const { handlePopupClick, tag } = this.props;

    if (id) {
      handlePopupClick({ ...tag, relevanceId: id });
    }
  }

  render() {
    const { messages, name, tagProperties, tag } = this.props;

    const isFilterTag = name === 'filter';
    const isTopicTag = name === 'topics';
    const isPrimaryTopic = !!tag.primary;

    return (
      <div
        {...tagClasses('', isTopicTag && !isPrimaryTopic && 'shouldHaveHover')}>
        <div {...tagClasses('description')}>{tag.name}</div>
        {isFilterTag && (
          <FilterRelevanceSelector
            currentRelevance={tag.relevanceId}
            messages={messages}
            tagProperties={tagProperties}
            handleSetTagProperty={this.handleSetTagProperty}
          />
        )}
        {isPrimaryTopic && (
          <div {...tagClasses('item')}>
            <strong>P</strong>
          </div>
        )}
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
