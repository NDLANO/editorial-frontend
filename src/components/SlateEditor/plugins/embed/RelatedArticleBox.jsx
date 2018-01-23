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
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import Types from 'slate-prop-types';
import { Button, RelatedArticleList, RelatedArticle } from 'ndla-ui';
import { Search } from 'ndla-icons/common';
import { get } from 'lodash';
import { Cross } from 'ndla-icons/action';
import { searchArticles } from '../../../../modules/search/searchApi';
import { fetchArticleResource } from '../../../../modules/taxonomy/taxonomyApi';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../schema';
import SlateEmbedPicker from '../blockPicker/SlateEmbedPicker';
import { mapping } from '../utils/relatedArticleMapping';

const classes = new BEMHelper({
  name: 'relatedBox',
  prefix: 'c-',
});

const nodeProps = ids => ({
  data: {
    resource: 'related-content',
    'article-ids': ids,
  },
});

class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [] };
    this.removeArticle = this.removeArticle.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
  }

  componentDidMount() {
    const { embed, node, editor } = this.props;
    if (embed['article-ids']) {
      embed['article-ids'].split(',').map(it => this.fetchRelated(it));
    } else if (embed.relatedArticle) {
      this.fetchRelated(embed.relatedArticle);

      // then add id to article-ids
      const next = editor.value
        .change()
        .setNodeByKey(node.key, nodeProps(embed.relatedArticle));
      editor.onChange(next);
    }
  }

  onInsertBlock(b) {
    const { editor, node } = this.props;
    const newArticle = getSchemaEmbed(b).relatedArticle;
    // get resource and add to state
    this.fetchRelated(newArticle);

    // update slate block attributes
    const next = editor.value
      .change()
      .setNodeByKey(
        node.key,
        nodeProps(
          `${this.state.items.map(it => it.id).join(',')},${newArticle}`,
        ),
      );
    editor.onChange(next);
  }

  async fetchRelated(it) {
    const { locale } = this.props;

    const [article, resource] = await Promise.all([
      searchArticles(`${it}`, locale),
      fetchArticleResource(it, locale),
    ]);

    this.setState(prevState => ({
      items: [...prevState.items, { ...article, resource }],
    }));
  }

  toggleOpen() {
    this.setState(prevState => ({ openSelect: !prevState.openSelect }));
  }

  removeArticle(i) {
    const { editor, node } = this.props;
    const newItems = this.state.items.filter((_, ind) => i !== ind);

    this.setState({ items: newItems });

    // remove from slate attribute
    const newIds = newItems.map(it => it.id).join(',');
    console.log(newIds);
    const next = editor.value
      .change()
      .setNodeByKey(node.key, nodeProps(newIds));
    editor.onChange(next);
  }

  render() {
    const { attributes } = this.props;
    const resourceType = item =>
      item.resourceTypes
        ? item.resourceTypes.find(it => mapping(it.id))
        : { id: '' };
    return (
      <div {...attributes} {...classes()}>
        {this.state.openSelect && (
          <SlateEmbedPicker
            isOpen={this.state.openSelect}
            resource="related-content"
            onEmbedClose={this.toggleOpen}
            onInsertBlock={this.onInsertBlock}
          />
        )}
        <RelatedArticleList messages={{ title: 'Relaterte arikler' }}>
          {this.state.items.map(
            (item, i) =>
              !item.id ? (
                'Invalid article'
              ) : (
                <div key={item.id} {...classes('article')}>
                  <RelatedArticle
                    {...mapping(resourceType(item).id)}
                    title={get(item, 'title.title')}
                    introduction={get(item, 'metaDescription.metaDescription')}
                    to={`/article/${item.id}`}
                  />
                  <Button
                    stripped
                    onClick={() => this.removeArticle(i)}
                    {...classes('delete-button')}>
                    <Cross />
                  </Button>
                </div>
              ),
          )}
        </RelatedArticleList>
        <Button
          stripped
          onClick={this.toggleOpen}
          {...classes('add-related-button')}>
          <Search className="c-icon--large" />
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
  editor: EditorShape,
  node: Types.node.isRequired,
  locale: PropTypes.string.isRequired,
  embed: PropTypes.shape({
    resource: PropTypes.string,
    'article-ids': PropTypes.string,
    relatedArticle: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(RelatedArticleBox));
