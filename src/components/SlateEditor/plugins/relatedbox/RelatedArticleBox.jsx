/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Types from 'slate-prop-types';
import {
  Button,
  RelatedArticleList,
  RelatedArticle,
  ContentTypeBadge,
  constants,
} from 'ndla-ui';
import { Search } from 'ndla-icons/common';
import { get } from 'lodash';
import { Cross } from 'ndla-icons/action';
import Lightbox from '../../../Lightbox';
import { Portal } from '../../../../components/Portal';
import { EditorShape } from '../../../../shapes';
import { searchArticles } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../../components/Dropdown/asyncDropdown/AsyncDropdown';

const classes = new BEMHelper({
  name: 'relatedBox',
  prefix: 'c-',
});

class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [], isOpened: true };
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.searchArticles = this.searchArticles.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.closeAndReturnFocusToEditor = this.closeAndReturnFocusToEditor.bind(
      this,
    );
  }

  onRemoveClick() {
    const { editor, node } = this.props;
    const next = editor.value.change().removeNodeByKey(node.key);
    editor.onChange(next);
  }
  onChange(selected) {
    console.log(selected);
    this.state.items.push(selected);
    this.toggleOpen();
  }

  async searchArticles(input) {
    const query = `?type=articles&query=${input}`;
    const response = await searchArticles(query, 'nb');
    return response.results;
  }

  toggleOpen() {
    console.log(this.state.isOpened);
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }));
  }

  closeAndReturnFocusToEditor() {
    const { editor } = this.props;
    editor.value.change().focus();
    this.toggleOpen();
  }

  render() {
    const { children, attributes } = this.props;
    return (
      <div {...attributes} {...classes()}>
        <Portal isOpened={this.state.isOpened}>
          <Lightbox display big onClose={this.closeAndReturnFocusToEditor}>
            <AsyncDropdown
              valueField="id"
              name="relatedArticleSearch"
              selectedItem={this.state.id}
              textField="title.title"
              placeholder={'placeholder'}
              label={'label'}
              apiAction={this.searchArticles}
              messages={{
                emptyFilter: 'empty',
                emptyList: 'empty list',
              }}
              onChange={this.onChange}
            />
            {this.props.children}
          </Lightbox>
        </Portal>
        <RelatedArticleList messages={{ title: 'Relaterte arikler' }}>
          {this.state.items.map(item => (
            <RelatedArticle
              key={item.id}
              icon={
                <ContentTypeBadge
                  background
                  type={constants.contentTypes.SUBJECT_MATERIAL}
                />
              }
              title={item.title.title}
              introduction={get(item, 'introduction.introduction')}
              to={`/article/${item.id}`}
              modifier="subject-material"
            />
          ))}
        </RelatedArticleList>
        <Button
          stripped
          onClick={this.toggleOpen}
          {...classes('add-related-button')}>
          <Search />
        </Button>
        <Button
          stripped
          onClick={this.onRemoveClick}
          {...classes('delete-button')}>
          <Cross />
        </Button>
      </div>
    );
  }
}

RelatedArticleBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default RelatedArticleBox;
