/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';
import { uuid } from '@ndla/util';
import { injectT } from '@ndla/i18n';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { RelatedArticleList } from '@ndla/ui';
import { toggleRelatedArticles } from '@ndla/article-scripts';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { fetchDraft } from '../../../../modules/draft/draftApi';
import { queryResources } from '../../../../modules/taxonomy';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape, AttributesShape } from '../../../../shapes';
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
    this.state = { articles: [], editMode: false };
    this.fetchArticle = this.fetchArticle.bind(this);
    this.updateArticles = this.updateArticles.bind(this);
    this.insertExternal = this.insertExternal.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.openEditMode = this.openEditMode.bind(this);
    this.setNodeData = this.setNodeData.bind(this);
  }

  componentDidMount() {
    const {
      element: { data },
    } = this.props;
    if (data && data.nodes) {
      const articleNodes = data.nodes;
      this.fetchArticles(articleNodes).then(articles =>
        this.setState({ articles: articles.filter(a => !!a) }),
      );
    } else {
      this.setState({ editMode: true });
    }
  }

  componentDidUpdate() {
    // need to re-add eventhandler on button
    if (!this.state.editMode && this.state.articles.length > 2) {
      toggleRelatedArticles();
    }
  }

  onInsertBlock(newArticle) {
    if (!this.state.articles.find(it => it.id === parseInt(newArticle, 10))) {
      // get resource and add to state
      this.fetchArticle(newArticle).then(article => {
        if (article) {
          this.setState(oldState => ({
            articles: [...oldState.articles, article],
          }));
          this.setNodeData();
        }
      });
    }
  }

  setNodeData() {
    const { editor, element } = this.props;
    const { articles } = this.state;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      {
        data: {
          nodes: articles.map(article =>
            article.id === ARTICLE_EXTERNAL
              ? {
                  resource: 'related-content',
                  url: article.url,
                  title: article.title,
                }
              : { resource: 'related-content', 'article-id': article.id },
          ),
        },
      },
      { at: path, voids: true },
    );
  }

  structureExternal(url, title) {
    return {
      id: ARTICLE_EXTERNAL,
      tempId: uuid(),
      url,
      title,
      description: '',
    };
  }

  async fetchArticle(id) {
    try {
      const { locale } = this.props;
      const [article, resource] = await Promise.all([
        fetchDraft(id, locale),
        queryResources(id, locale),
      ]);
      if (article) {
        return mapRelatedArticle(article, resource);
      }
    } catch (error) {
      handleError(error);
    }
  }
  async fetchArticles(nodes) {
    return Promise.all(
      nodes.map(node => {
        const articleId = node['article-id'];
        if (articleId) {
          return this.fetchArticle(articleId);
        } else if (node.title) {
          return this.structureExternal(node.url, node.title);
        }
        return undefined;
      }),
    );
  }

  async insertExternal(url, title) {
    // await get description meta data
    this.setState(
      prevState => ({
        articles: [...prevState.articles, this.structureExternal(url, title)],
        editMode: false,
      }),
      this.setNodeData,
    );
  }

  updateArticles(newArticles) {
    this.setState({ articles: newArticles.filter(a => !!a) }, this.setNodeData);
  }

  openEditMode(e) {
    e.stopPropagation();
    this.setState({ editMode: true });
  }

  render() {
    const { attributes, onRemoveClick, locale, t, children } = this.props;
    const { editMode, articles } = this.state;

    if (editMode) {
      return (
        <EditRelated
          onRemoveClick={onRemoveClick}
          articles={articles}
          locale={locale}
          insertExternal={this.insertExternal}
          onInsertBlock={this.onInsertBlock}
          onExit={() => this.setState({ editMode: false })}
          updateArticles={this.updateArticles}
          {...attributes}
        />
      );
    }

    return (
      <div
        role="button"
        draggable
        contentEditable={false}
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
          {articles.map((item, i) =>
            !item.id ? (
              t('form.content.relatedArticle.invalidArticle')
            ) : (
              <RelatedArticle key={uuid()} numberInList={i} item={item} />
            ),
          )}
        </RelatedArticleList>
        {children}
      </div>
    );
  }
}

RelatedArticleBox.propTypes = {
  attributes: AttributesShape,
  editor: EditorShape.isRequired,
  element: PropTypes.any,
  locale: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(injectT, connect(mapStateToProps, null))(RelatedArticleBox);
