/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import Button from '@ndla/button'; //checked
import { Cross } from '@ndla/icons/action';
import { searchRelatedArticles } from '../../../../modules/article/articleApi';
import AsyncDropdown from '../../../Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../Overlay';
import RelatedArticle from './RelatedArticle';
import TaxonomyLightbox from '../../../TaxonomyLightbox';
import { Portal } from '../../../Portal';
import DeleteButton from '../../../DeleteButton';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

class EditRelated extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showAddExternal: false,
      url: '',
      title: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleAddExternal = this.toggleAddExternal.bind(this);
    this.searchForArticles = this.searchForArticles.bind(this);
  }

  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.background = 'white';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top + 50}px`;
    embedEl.style.left = `${placeholderRect.left - 50}px`;
    embedEl.style.width = `${placeholderRect.width + 100}px`;

    const embedRect = embedEl.getBoundingClientRect();
    placeholderEl.style.height = `${embedRect.height}px`;
  }

  componentDidUpdate() {
    const { placeholderEl, embedEl } = this;

    const embedRect = embedEl.getBoundingClientRect();
    placeholderEl.style.height = `${embedRect.height + 120}px`;
  }

  handleInputChange(e) {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  toggleAddExternal() {
    this.setState(prevState => ({
      showAddExternal: !prevState.showAddExternal,
    }));
  }

  async searchForArticles(inp) {
    const articles = await searchRelatedArticles(inp, this.props.locale);
    return articles
      .map(article => ({
        id: article.id,
        title: article.title ? article.title.title : '',
      }))
      .filter(article => !!article.id);
  }

  render() {
    const {
      onRemoveClick,
      removeArticle,
      insertExternal,
      items,
      locale,
      onInsertBlock,
      onExit,
      t,
      ...rest
    } = this.props;
    const { title, url } = this.state;
    const relatedArticles = items.map(
      (relatedArticle, i) =>
        !relatedArticle.id ? (
          t('form.content.relatedArticle.invalidArticle')
        ) : (
          <div key={relatedArticle.id} {...classes('article')}>
            <RelatedArticle locale={locale} item={relatedArticle} />
            <DeleteButton stripped onClick={e => removeArticle(i, e)}>
              <Cross />
            </DeleteButton>
          </div>
        ),
    );

    return (
      <div>
        <Overlay onExit={onExit} />
        <div
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}>
          <Portal isOpened>
            <div
              {...classes()}
              ref={embedEl => {
                this.embedEl = embedEl;
              }}
              {...rest}>
              {relatedArticles}
              <div {...classes('article')}>
                <AsyncDropdown
                  valueField="id"
                  name="relatedArticleSearch"
                  textField="title"
                  placeholder={t('form.content.relatedArticle.placeholder')}
                  label="label"
                  apiAction={this.searchForArticles}
                  onClick={e => e.stopPropagation()}
                  messages={{
                    emptyFilter: t('form.content.relatedArticle.emptyFilter'),
                    emptyList: t('form.content.relatedArticle.emptyList'),
                  }}
                  onChange={selected => selected && onInsertBlock(selected.id)}
                />
                <div>{t('taxonomy.or')}</div>
                <Button
                  data-testid="showAddExternal"
                  onClick={this.toggleAddExternal}>
                  {t('form.content.relatedArticle.addExternal')}
                </Button>
              </div>
              <DeleteButton stripped onClick={onRemoveClick}>
                <Cross />
              </DeleteButton>
            </div>
            {this.state.showAddExternal && (
              <TaxonomyLightbox
                onSelect={() => insertExternal(url, title)}
                title={t('form.content.relatedArticle.searchExternal')}
                onClose={this.toggleAddExternal}>
                <input
                  type="text"
                  id="url"
                  data-testid="addExternalUrlInput"
                  onChange={this.handleInputChange}
                  onClick={e => e.stopPropagation()}
                  value={url}
                  placeholder={t('form.content.relatedArticle.urlPlaceholder')}
                />
                <input
                  type="text"
                  id="title"
                  data-testid="addExternalTitleInput"
                  value={title}
                  onChange={this.handleInputChange}
                  onClick={e => e.stopPropagation()}
                  placeholder={t(
                    'form.content.relatedArticle.titlePlaceholder',
                  )}
                />
              </TaxonomyLightbox>
            )}
          </Portal>
        </div>
      </div>
    );
  }
}

EditRelated.propTypes = {
  onRemoveClick: PropTypes.func,
  removeArticle: PropTypes.func,
  onExit: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
  onInsertBlock: PropTypes.func,
  locale: PropTypes.string,
  insertExternal: PropTypes.func,
};

export default injectT(EditRelated);
