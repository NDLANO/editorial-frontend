/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import darken from 'polished/lib/color/darken';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { colors, spacing } from '@ndla/core';
import { search } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../Overlay';
import RelatedArticle from './RelatedArticle';
import ContentLink from '../../../../containers/ArticlePage/components/ContentLink';
import DeleteButton from '../../../DeleteButton';
import { ARTICLE_EXTERNAL } from '../../../../constants';

const StyledContainer = styled('div')`
  position: absolute;
  width: 100%;
`;

const StyledBorderDiv = styled('div')`
  position: relative;
  border: 2px solid ${colors.brand.tertiary};
  padding: ${spacing.large};
  padding-top: 0;
  background-color: ${colors.white};
  z-index: 1;
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

const StyledEditButton = styled(Button)`
  position: absolute;
  top: 0.1rem;
  right: 1.5rem;
  color: ${colors.support.red};

  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.red)};
  }
`;

const StyledDropZone = styled('div')`
  flex: 1;
`;

class EditRelated extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showAddExternal: false,
      tempId: undefined,
      url: '',
      title: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleAddExternal = this.toggleAddExternal.bind(this);
    this.searchForArticles = this.searchForArticles.bind(this);
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

  async searchForArticles(query, page) {
    return search({
      query,
      page,
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

    return (
      <StyledContainer contentEditable={false}>
        <Overlay onExit={onExit} />
        <StyledBorderDiv {...rest}>
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
                  <StyledDropZone
                    ref={provided.innerRef}
                    className={snapshot.isDraggingOver ? 'drop-zone dragging' : 'drop-zone'}>
                    {articles.map((article, index) => {
                      if (!article) {
                        return null;
                      }
                      const articleKey =
                        article.id === ARTICLE_EXTERNAL ? article.tempId : article.id;
                      return (
                        <Draggable key={articleKey} draggableId={articleKey} index={index}>
                          {(providedInner, snapshotInner) => (
                            <div
                              className="drag-item"
                              ref={providedInner.innerRef}
                              {...providedInner.dragHandleProps}
                              {...providedInner.draggableProps}>
                              <StyledArticle
                                isDragging={snapshotInner.isDragging}
                                dragHandleProps={providedInner.dragHandleProps}
                                key={article.id}>
                                <RelatedArticle item={article} />
                                {article.id === ARTICLE_EXTERNAL && (
                                  <StyledEditButton
                                    stripped
                                    onClick={() => {
                                      this.setState({
                                        tempId: article.tempId,
                                        url: article.url,
                                        title: article.title,
                                      });
                                      this.toggleAddExternal();
                                    }}>
                                    <Tooltip
                                      tooltip={t('form.content.relatedArticle.changeExternal')}>
                                      <Pencil />
                                    </Tooltip>
                                  </StyledEditButton>
                                )}
                                <DeleteButton
                                  title={t('form.content.relatedArticle.removeExternal')}
                                  stripped
                                  onClick={e => {
                                    e.stopPropagation();

                                    const newArticles = articles.filter(filterArticle =>
                                      filterArticle.id === ARTICLE_EXTERNAL
                                        ? filterArticle.tempId !== articleKey
                                        : filterArticle.id !== articleKey,
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
                  </StyledDropZone>
                )}
              </Droppable>
            </DragDropContext>
          </StyledListWrapper>
          <StyledArticle data-cy="styled-article-modal">
            <AsyncDropdown
              idField="id"
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
            <Button data-testid="showAddExternal" onClick={this.toggleAddExternal}>
              {t('form.content.relatedArticle.addExternal')}
            </Button>
          </StyledArticle>
          <DeleteButton stripped onClick={onRemoveClick} />
        </StyledBorderDiv>
        {this.state.showAddExternal && (
          <ContentLink
            onAddLink={(title, url) => {
              if (this.state.tempId) {
                updateArticles(
                  articles.map(a => (a.tempId === this.state.tempId ? { ...a, url, title } : a)),
                );
                this.setState({
                  tempId: undefined,
                  url: '',
                  title: '',
                });
              } else {
                insertExternal(url, title);
              }
            }}
            onClose={() => {
              this.setState({
                tempId: undefined,
                url: '',
                title: '',
              });
              this.toggleAddExternal();
            }}
            initialTitle={this.state.title}
            initialUrl={this.state.url}
          />
        )}
      </StyledContainer>
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

export default withTranslation()(EditRelated);
