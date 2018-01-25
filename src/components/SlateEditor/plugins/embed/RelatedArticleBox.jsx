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
import { get } from 'lodash';
import { Cross } from 'ndla-icons/action';
import {
  searchArticles,
  searchRelatedArticles,
} from '../../../../modules/search/searchApi';
import { fetchArticleResource } from '../../../../modules/taxonomy/taxonomyApi';
import AsyncDropdown from '../../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../../components/Overlay';
import { getLocale } from '../../../../modules/locale/locale';
import { EditorShape } from '../../../../shapes';
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
    this.state = { items: [], editMode: false };
    this.removeArticle = this.removeArticle.bind(this);
    this.fetchRelated = this.fetchRelated.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.updateNodeAttributes = this.updateNodeAttributes.bind(this);
  }

  componentDidMount() {
    const { embed } = this.props;
    if (embed['article-ids']) {
      embed['article-ids'].split(',').map(it => this.fetchRelated(it));
    } else if (embed.relatedArticle) {
      this.fetchRelated(embed.relatedArticle);

      // then add id to article-ids
      this.updateNodeAttributes(embed.relatedArticle);
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
    const { attributes, onRemoveClick, locale } = this.props;
    const { editMode, items } = this.state;
    const resourceType = item =>
      item.resourceTypes
        ? item.resourceTypes.find(it => mapping(it.id))
        : { id: '' };
    const relatedArticles = items.map(
      (item, i) =>
        !item.id ? (
          'Invalid article'
        ) : (
          <div key={item.id} {...classes('article')}>
            <RelatedArticle
              {...mapping(resourceType(item).id)}
              title={get(item, 'title.title')}
              introduction={get(item, 'metaDescription.metaDescription')}
              to={`/learning-resource/${item.id}/edit/${locale}`}
            />
            {editMode && (
              <Button
                stripped
                onClick={e => this.removeArticle(i, e)}
                {...classes('delete-button')}>
                <Cross />
              </Button>
            )}
          </div>
        ),
    );
    return this.state.editMode ? (
      <div>
        <Overlay onExit={() => this.setState({ editMode: false })} />
        <div {...classes()}>
          <RelatedArticleList messages={{ title: 'Relaterte arikler' }}>
            {relatedArticles}
            <div {...classes('article')}>
              <AsyncDropdown
                valueField="id"
                name="relatedArticleSearch"
                textField="title.title"
                placeholder={'Søk på tittel'}
                label={'label'}
                apiAction={async inp => {
                  const res = await searchRelatedArticles(
                    inp,
                    this.props.locale,
                  );
                  return res.filter(
                    it =>
                      this.state.items.map(curr => curr.id).indexOf(it.id) ===
                      -1,
                  );
                }}
                onClick={e => e.stopPropagation()}
                messages={{
                  emptyFilter: 'empty',
                  emptyList: 'empty list',
                }}
                onChange={selected =>
                  selected && this.onInsertBlock(selected.id)
                }
              />
            </div>
          </RelatedArticleList>
          <Button
            stripped
            onClick={onRemoveClick}
            {...classes('delete-button')}>
            <Cross />
          </Button>
        </div>
      </div>
    ) : (
      <div
        role="button"
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          this.setState({ editMode: true });
        }}
        {...attributes}>
        <RelatedArticleList messages={{ title: 'Relaterte arikler' }}>
          {relatedArticles}
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
