/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { tagClasses } from '../../../../components/Tag';

class SearchTag extends Component {
  constructor(props) {
    super(props);
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
    const { tag, t } = this.props;

    return (
      <dl className="c-tag c-tag--search">
        <dt {...tagClasses('label')}>{t(`searchForm.tagType.${tag.type}`)}:</dt>
        <dd {...tagClasses('description')}>{tag.name}</dd>
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </dl>
    );
  }
}

SearchTag.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onRemoveItem: PropTypes.func,
};

export default injectT(SearchTag);
