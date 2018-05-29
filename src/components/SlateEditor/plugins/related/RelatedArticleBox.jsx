/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import Types from 'slate-prop-types';
import { RelatedArticleList } from 'ndla-ui';
import { toggleRelatedArticles } from 'ndla-article-scripts';
import { searchArticles } from '../../../../modules/article/articleApi';
import { queryResources } from '../../../../modules/taxonomy/taxonomyApi';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape } from '../../../../shapes';
import EditRelated from './EditRelated';
import handleError from '../../../../util/handleError';
import RelatedArticle from './RelatedArticle';
import { ARTICLE_EXTERNAL } from '../../../../constants';

class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [], editMode: true };
    this.removeArticle = this.removeArticle.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.fetchExternal = this.fetchExternal.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.updateEmbedNode = this.updateEmbedNode.bind(this);
  }

  componentDidMount() {
    const { node: { data } } = this.props;
    if (data.get('nodes')) {
      data.get('nodes').forEach(({ articleId, title, url }) => {
        if (articleId) this.fetchRelated(articleId);
        if (title) {
          this.fetchExternal(url, title);
        }
      });
    }
  }

  componentDidUpdate() {
    // need to re-add eventhandler on button
    if (!this.state.editMode && this.state.items.length > 2) {
      toggleRelatedArticles();
    }
  }

  onInsertBlock(newArticle) {
    if (!this.state.items.find(it => it.id === parseInt(newArticle, 10))) {
      // get resource and add to state
      this.fetchRelated(newArticle);
    }
  }

  updateEmbedNode() {
    const { editor, node } = this.props;
    const { items } = this.state;
    console.log(items);
    editor.change(change =>
      change.setNodeByKey(node.key, {
        data: {
          nodes: items.map(
            item =>
              item.id === ARTICLE_EXTERNAL
                ? { url: item.url, title: item.title }
                : { resource: 'related-content', ['article-id']: item.id }, // eslint-disable-line
          ),
        },
      }),
    );
  }

  async fetchRelated(id) {
    const { locale } = this.props;

    try {
      const [article, resource] = await Promise.all([
        searchArticles(id, locale),
        queryResources(id, locale),
      ]);
      if (article)
        this.setState(
          prevState => ({
            items: [...prevState.items, { ...article, resource }],
            editMode: false,
          }),
          this.updateEmbedNode,
        );
    } catch (error) {
      handleError(error);
    }
  }

  async fetchExternal(url, title) {
    // await get description meta data
    this.setState(
      prevState => ({
        items: [
          ...prevState.items,
          {
            id: ARTICLE_EXTERNAL,
            url,
            title,
            description: '',
          },
        ],
        editMode: false,
      }),
      this.updateEmbedNode,
    );
  }

  removeArticle(i, e) {
    e.stopPropagation();

    const newItems = this.state.items.filter((_, ind) => i !== ind);
    this.setState({ items: newItems }, this.updateEmbedNode);
  }

  render() {
    const { attributes, onRemoveClick, locale, t } = this.props;
    const { editMode, items } = this.state;

    return editMode ? (
      <EditRelated
        {...{
          onRemoveClick,
          items,
          locale,
          ...attributes,
        }}
        insertExternal={this.fetchExternal}
        onInsertBlock={this.onInsertBlock}
        onExit={() => this.setState({ editMode: false })}
        removeArticle={this.removeArticle}
      />
    ) : (
      <div
        role="button"
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          this.setState({ editMode: true });
        }}
        onKeyPress={e => {
          e.stopPropagation();
          this.setState({ editMode: true });
        }}
        {...attributes}>
        <RelatedArticleList
          messages={{
            title: t('form.related.title'),
            showMore: t('form.related.showMore'),
            showLess: t('form.related.showLess'),
          }}>
          {items.map(
            item =>
              !item.id ? (
                'Invalid article'
              ) : (
                <RelatedArticle key={item.id} locale={locale} item={item} />
              ),
          )}
        </RelatedArticleList>
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
  onRemoveClick: PropTypes.func,
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
