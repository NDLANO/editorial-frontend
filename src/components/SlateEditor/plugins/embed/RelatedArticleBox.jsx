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
import { RelatedArticleList, RelatedArticle } from 'ndla-ui';
import { toggleRelatedArticles } from 'ndla-article-scripts';
import get from 'lodash/fp/get';
import { searchArticles } from '../../../../modules/article/articleApi';
import { fetchArticleResource } from '../../../../modules/taxonomy/taxonomyApi';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape } from '../../../../shapes';
import { mapping } from '../utils/relatedArticleMapping';
import EditRelated from './EditRelated';

const nodeProps = ids => ({
  data: {
    resource: 'related-content',
    'article-ids': ids,
  },
});

class RelatedArticleBox extends React.Component {
  constructor() {
    super();
    this.state = { items: [], editMode: true };
    this.removeArticle = this.removeArticle.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.updateNodeAttributes = this.updateNodeAttributes.bind(this);
  }

  componentDidMount() {
    const { embed } = this.props;
    if (embed['article-ids']) {
      embed['article-ids'].split(',').map(it => this.fetchRelated(it));
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
      const currentIds = this.state.items.map(it => it.id).join(',');
      this.updateNodeAttributes(
        `${currentIds}${currentIds ? ',' : ''}${newArticle}`,
      );
    }
  }

  updateNodeAttributes(ids) {
    const { editor, node } = this.props;
    editor.change(change => change.setNodeByKey(node.key, nodeProps(ids)));
  }

  async fetchRelated(it) {
    const { locale } = this.props;

    const [article, resource] = await Promise.all([
      searchArticles(`${it}`, locale),
      fetchArticleResource(it, locale),
    ]);

    this.setState(prevState => ({
      items: [...prevState.items, { ...article, resource }],
      editMode: false,
    }));
  }

  removeArticle(i, e) {
    e.stopPropagation();

    const newItems = this.state.items.filter((_, ind) => i !== ind);
    this.setState({ items: newItems });

    // remove from slate attribute
    this.updateNodeAttributes(newItems.map(it => it.id).join(','));
  }

  render() {
    const { attributes, onRemoveClick, locale, t } = this.props;
    const { editMode, items } = this.state;

    const resourceType = item =>
      item.resourceTypes
        ? item.resourceTypes.find(it => mapping(it.id))
        : { id: '' };

    return this.state.editMode ? (
      <EditRelated
        {...{
          onRemoveClick,
          removeArticle: this.removeArticle,
          resourceType,
          items,
          editMode,
          locale,
          onInsertBlock: this.onInsertBlock,
          onExit: () => this.setState({ editMode: false }),
        }}
      />
    ) : (
      <div
        role="button"
        tabIndex={0}
        onClick={e => {
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
                <RelatedArticle
                  {...mapping(resourceType(item).id)}
                  title={get('title.title', item)}
                  key={item.id}
                  introduction={get('metaDescription.metaDescription', item)}
                  to={`/learning-resource/${item.id}/edit/${locale}`}
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
