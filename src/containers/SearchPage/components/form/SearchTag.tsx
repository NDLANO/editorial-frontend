/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';

export type MinimalTagType = {
  name?: string;
  type: string;
};

export const tagClasses = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

interface Props {
  tag: MinimalTagType;
  onRemoveItem: (tag: MinimalTagType) => void;
}

class SearchTag extends Component<Props & CustomWithTranslation> {
  constructor(props: Props & CustomWithTranslation) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(e: React.MouseEvent<HTMLButtonElement>) {
    const { onRemoveItem, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    onRemoveItem(tag);
  }

  render() {
    const { tag, t } = this.props;

    return (
      <dl className="c-tag c-tag--search" data-cy={`${tag.type}-tag`}>
        <dt {...tagClasses('label')}>{t(`searchForm.tagType.${tag.type}`)}:</dt>
        <dd {...tagClasses('description')}>{tag.name || ''}</dd>
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </dl>
    );
  }

  static propTypes = {
    tag: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    onRemoveItem: PropTypes.func.isRequired,
  };
}

export default withTranslation()(SearchTag);
