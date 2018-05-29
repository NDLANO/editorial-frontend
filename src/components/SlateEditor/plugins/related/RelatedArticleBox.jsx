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
import { defaultEmbedBlock } from '../../schema';

const nodeProps = id => ({
  data: {
    resource: 'related-content',
    'article-id': id,
  },
});

class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [], editMode: true };
    this.removeArticle = this.removeArticle.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.addEmbedNode = this.addEmbedNode.bind(this);
    this.removeEmbedNode = this.removeEmbedNode.bind(this);
    this.onInsertExternal = this.onInsertExternal.bind(this);
  }

  componentDidMount() {
    const { node } = this.props;

    if (node.nodes) {
      node.nodes.forEach(it => {
        if (it.data.get('article-id'))
          this.fetchRelated(it.data.get('article-id'), it.key);
        if (it.data.get('title')) {
          this.fetchExternal({
            title: it.data.get('title'),
            url: it.data.get('url'),
            key: it.key,
          });
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

      // update slate block attributes
      this.addEmbedNode(newArticle);
    }
  }

  onInsertExternal(url, title) {
    const { editor, node } = this.props;
    const insertEmbed = defaultEmbedBlock();
    editor.change(change =>
      change
        .insertNodeByKey(node.key, this.state.items.length, insertEmbed)
        .setNodeByKey(insertEmbed.key, {
          data: {
            resource: 'related-content',
            title,
            url,
          },
        }),
    );
    this.fetchExternal({ title, url, key: insertEmbed.key });
  }

  addEmbedNode(id) {
    const { editor, node } = this.props;
    const insertEmbed = defaultEmbedBlock();
    editor.change(change =>
      change
        .insertNodeByKey(node.key, this.state.items.length, insertEmbed)
        .setNodeByKey(insertEmbed.key, nodeProps(id)),
    );
  }

  removeEmbedNode(i) {
    const { editor } = this.props;
    editor.change(change => change.removeNodeByKey(this.state.items[i].key));
  }

  async fetchRelated(id, key) {
    const { locale } = this.props;

    try {
      const [article, resource] = await Promise.all([
        searchArticles(id, locale),
        queryResources(id, locale),
      ]);
      if (article)
        this.setState(prevState => ({
          items: [...prevState.items, { ...article, resource, key }],
          editMode: false,
        }));
    } catch (error) {
      handleError(error);
    }
  }

  async fetchExternal({ url, title, key }) {
    // await get description meta data
    this.setState(prevState => ({
      items: [
        ...prevState.items,
        {
          id: 'external-learning-resources',
          url,
          title,
          description: '',
          key,
        },
      ],
      editMode: false,
    }));
  }

  removeArticle(i, e) {
    e.stopPropagation();

    const newItems = this.state.items.filter((_, ind) => i !== ind);
    this.setState({ items: newItems });

    // remove from slate attribute
    this.removeEmbedNode(i);
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
        insertExternal={this.onInsertExternal}
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
