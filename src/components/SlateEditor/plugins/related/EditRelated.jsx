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
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { Pencil } from '@ndla/icons/action';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { colors, spacing } from '@ndla/core';
import { search } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../Overlay';
import RelatedArticle from './RelatedArticle';
import TaxonomyLightbox from '../../../Taxonomy/TaxonomyLightbox';
import { Portal } from '../../../Portal';
import DeleteButton from '../../../DeleteButton';
import { ARTICLE_EXTERNAL } from '../../../../constants';

const StyledBorderDiv = styled('div')`
  position: relative;
  border: 2px solid ${colors.brand.tertiary};
  padding: ${spacing.large};
  padding-top: 0;
`;

const StyledListWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  z-index: 1;

  & figure {
    position: static !important;
  }
`;

const StyledArticle = styled('div')`
  position: relative;
  flex: 1 0 50%;
  max-width: 600px;

  & > article {
    max-width: 100%;
  }
`;

const StyledOr = styled('div')`
  margin: 10px 0;
`;

class EditRelated extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showAddExternal: false,
      index: undefined,
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
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
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

  async searchForArticles(query) {
    return await search({
      query: query.query,
      page: query.page,
      'context-types': 'standard, topic-article',
    });
  }

  render() {
    const {
      onRemoveClick,
      updateArticles,
      insertExternal,
      articles,
      onInsertBlock,
      onExit,
      t,
      ...rest
    } = this.props;
    const { title, url } = this.state;

    return (
      <div>
        <Overlay onExit={onExit} />
        <div
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}>
          <Portal isOpened>
            <StyledBorderDiv
              ref={embedEl => {
                this.embedEl = embedEl;
              }}
              {...rest}>
              <h1 className="c-section-heading c-related-articles__component-title">
                {t('form.related.title')}
              </h1>
              <p>{t('form.related.subtitle')}</p>
              <StyledListWrapper>
                <DragDropContext
                  onDragEnd={a => {
                    if (!a.destination) {
                      return;
                    }
                    const toIndex = a.destination.index;
                    const fromIndex = a.source.index;
                    const newArticles = [...articles];

                    var element = newArticles[fromIndex];
                    newArticles.splice(fromIndex, 1);
                    newArticles.splice(toIndex, 0, element);
                    updateArticles(newArticles);
                  }}>
                  <Droppable droppableId="relatedArticleDroppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        className={
                          snapshot.isDraggingOver
                            ? 'drop-zone dragging'
                            : 'drop-zone'
                        }>
                        {articles.map((article, index) => {
                          if (!article) {
                            return null;
                          }
                          return (
                            <Draggable
                              key={article.id}
                              draggableId={article.id}
                              index={index}>
                              {(providedInner, snapshotInner) => (
                                <div
                                  className="drag-item"
                                  ref={providedInner.innerRef}
                                  {...providedInner.dragHandleProps}
                                  {...providedInner.draggableProps}>
                                  <StyledArticle
                                    isDragging={snapshotInner.isDragging}
                                    dragHandleProps={
                                      providedInner.dragHandleProps
                                    }
                                    key={article.id}>
                                    {article.id === ARTICLE_EXTERNAL && (
                                      <Button
                                        stripped
                                        data-testid="showAddExternal"
                                        style={{ marginLeft: '32px' }}
                                        onClick={() => {
                                          this.setState({
                                            index,
                                            url: article.url,
                                            title: article.title,
                                          });
                                          this.toggleAddExternal();
                                        }}>
                                        <Pencil />
                                        {t(
                                          'form.content.relatedArticle.changeExternal',
                                        )}
                                      </Button>
                                    )}
                                    <RelatedArticle item={article} />
                                    <DeleteButton
                                      title="Fjern relaterte artikler"
                                      stripped
                                      onClick={e => {
                                        e.stopPropagation();

                                        const newArticles = articles.filter(
                                          filterArticle =>
                                            filterArticle.id !== article.id,
                                        );
                                        updateArticles(newArticles);
                                      }}
                                    />
                                  </StyledArticle>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </StyledListWrapper>
              <StyledArticle data-cy="styled-article-modal">
                <AsyncDropdown
                  idField="id"
                  name="relatedArticleSearch"
                  labelField="title"
                  placeholder={t('form.content.relatedArticle.placeholder')}
                  label="label"
                  apiAction={this.searchForArticles}
                  onClick={e => e.stopPropagation()}
                  onChange={selected => selected && onInsertBlock(selected.id)}
                  positionAbsolute
                  showPagination
                />
                <StyledOr>{t('taxonomy.or')}</StyledOr>
                <Button
                  data-testid="showAddExternal"
                  onClick={this.toggleAddExternal}>
                  {t('form.content.relatedArticle.addExternal')}
                </Button>
              </StyledArticle>
              <DeleteButton stripped onClick={onRemoveClick} />
            </StyledBorderDiv>
            {this.state.showAddExternal && (
              <TaxonomyLightbox
                onSelect={() => {
                  if (this.state.index) {
                    updateArticles(
                      articles.map((a, index) =>
                        index === this.state.index ? { ...a, url, title } : a,
                      ),
                    );
                    this.setState({
                      showAddExternal: false,
                      index: undefined,
                      url: '',
                      title: '',
                    });
                  } else {
                    insertExternal(url, title);
                  }
                }}
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
  updateArticles: PropTypes.func,
  onExit: PropTypes.func,
  articles: PropTypes.arrayOf(PropTypes.object),
  onInsertBlock: PropTypes.func,
  insertExternal: PropTypes.func,
};

export default injectT(EditRelated);
