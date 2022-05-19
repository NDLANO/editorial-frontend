/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, MouseEvent } from 'react';

import { withTranslation, CustomWithTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import { searchParamsFormatter } from './SearchForm';
import { TagType } from './SearchTagGroup';

export const tagClasses = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

interface Props {
  tag: TagType;
  onRemoveItem: (tag: TagType) => void;
}

class SearchTag extends Component<Props & CustomWithTranslation> {
  constructor(props: Props & CustomWithTranslation) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(e: MouseEvent<HTMLButtonElement>) {
    const { onRemoveItem, tag } = this.props;
    e.preventDefault();
    e.stopPropagation();
    onRemoveItem(tag);
  }

  render() {
    const { tag, t } = this.props;
    const tagValue = searchParamsFormatter(tag.type, tag.name) || '';

    return (
      <dl className="c-tag c-tag--search">
        <dt {...tagClasses('label')}>{t(`searchForm.tagType.${tag.type}`)}:</dt>
        <dd {...tagClasses('description')}>{tagValue}</dd>
        <Button onClick={this.onRemove} stripped>
          <Cross className="c-icon--small" />
        </Button>
      </dl>
    );
  }
}

export default withTranslation()(SearchTag);
