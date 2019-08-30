/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from '@ndla/util';
import { injectT } from '@ndla/i18n';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Types from 'slate-prop-types';
import { css } from '@emotion/core';
import { RelatedArticleList } from '@ndla/ui';
import { toggleRelatedArticles } from '@ndla/article-scripts';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { searchArticles } from '../../../../modules/article/articleApi';
import { queryResources } from '../../../../modules/taxonomy';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape } from '../../../../shapes';
import EditRelated from './EditRelated';
import handleError from '../../../../util/handleError';
import RelatedArticle from './RelatedArticle';
import { ARTICLE_EXTERNAL } from '../../../../constants';

const mapRelatedArticle = (article, resource) => ({
  ...article,
  resource,
  id: `${article.id}`,
  title: convertFieldWithFallback(article, 'title', article.title),
});

export class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [], editMode: false };
    this.removeArticle = this.removeArticle.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.fetchExternal = this.fetchExternal.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.updateEmbedNode = this.updateEmbedNode.bind(this);
    this.openEditMode = this.openEditMode.bind(this);
    this.setNodeKey = this.setNodeKey.bind(this);
  }

  componentDidMount() {
    const {
      node: { data },
    } = this.props;
    if (data && data.get('nodes')) {
      data.get('nodes').forEach(article => {
        const articleId = article['article-id'];
        if (articleId) {
          this.fetchRelated(articleId, true);
        }
        if (article.title) {
          this.fetchExternal(article.url, article.title, true);
        }
      });
    } else {
      this.setState({ editMode: true });
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

  setNodeKey() {
    const { editor, node } = this.props;
    const { items } = this.state;

    editor.setNodeByKey(node.key, {
      data: {
        nodes: items.map(
          item =>
            item.id === ARTICLE_EXTERNAL
              ? {
                  resource: 'related-content',
                  url: item.url,
                  title: item.title,
                }
              : { resource: 'related-content', ['article-id']: item.id }, // eslint-disable-line
        ),
      },
    });
  }

  updateEmbedNode(onMount) {
    if (!onMount) this.setNodeKey();
  }

  async fetchRelated(id, onMount = false) {
    const { locale } = this.props;
    try {
      const [article, resource] = await Promise.all([
        searchArticles(id, locale),
        queryResources(id, locale),
      ]);
      if (article) {
        this.setState(
          prevState => ({
            items: [...prevState.items, mapRelatedArticle(article, resource)],
            editMode: false,
          }),
          () => this.updateEmbedNode(onMount),
        );
      }
    } catch (error) {
      handleError(error);
    }
  }

  async fetchExternal(url, title, onMount = false) {
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
      () => this.updateEmbedNode(onMount),
    );
  }

  removeArticle(i, e) {
    const { items } = this.state;
    e.stopPropagation();

    const newItems = items.filter((_, ind) => i !== ind);
    this.setState({ items: newItems }, this.updateEmbedNode);
  }

  openEditMode(e) {
    e.stopPropagation();
    this.setState({ editMode: true });
  }

  render() {
    const { attributes, onRemoveClick, locale, t } = this.props;
    const { editMode, items } = this.state;
    if (editMode) {
      return (
        <EditRelated
          onRemoveClick={onRemoveClick}
          items={items}
          locale={locale}
          insertExternal={this.fetchExternal}
          onInsertBlock={this.onInsertBlock}
          onExit={() => this.setState({ editMode: false })}
          removeArticle={this.removeArticle}
          {...attributes}
        />
      );
    }

    return (
      <div
        role="button"
        draggable
        tabIndex={0}
        data-testid="relatedWrapper"
        onClick={this.openEditMode}
        onKeyPress={this.openEditMode}
        css={css`
          & article > p {
            font-family: Source Sans Pro !important;
          }
        `}
        {...attributes}>
        <RelatedArticleList
          messages={{
            title: t('form.related.title'),
            showMore: t('form.related.showMore'),
            showLess: t('form.related.showLess'),
          }}>
          {items.map((item, i) =>
            !item.id ? (
              t('form.content.relatedArticle.invalidArticle')
            ) : (
              <RelatedArticle
                key={uuid()}
                numberInList={i}
                locale={locale}
                item={item}
              />
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
  editor: EditorShape.isRequired,
  node: PropTypes.oneOfType([Types.node, PropTypes.shape({})]).isRequired,
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

export default compose(
  injectT,
  connect(
    mapStateToProps,
    null,
  ),
)(RelatedArticleBox);
