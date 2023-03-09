/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SectionHeading } from '@ndla/ui';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { search } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../Overlay';
import RelatedArticle from './RelatedArticle';
import ContentLink from '../../../../containers/ArticlePage/components/ContentLink';
import DeleteButton from '../../../DeleteButton';
import { RelatedArticleType, ExternalArticle } from './RelatedArticleBox';

const StyledContainer = styled('div')`
  position: absolute;
  width: 100%;
  z-index: 2;
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  justify-content: space-between;
  align-items: top;
  max-width: 600px;
  & > article {
    flex: 1;
    max-width: 100%;
  }
`;

const StyledOr = styled('div')`
  margin: 10px 0;
`;

const StyledDropZone = styled('div')`
  flex: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
`;

interface Props {
  onRemoveClick: (e: MouseEvent<HTMLButtonElement>) => void;
  updateArticles: (newArticles: RelatedArticleType[]) => void;
  onExit: () => void;
  articles: RelatedArticleType[];
  onInsertBlock: (newArticle: string) => void;
  insertExternal: (url: string, title: string) => Promise<void>;
}

const EditRelated = ({
  onRemoveClick,
  updateArticles,
  insertExternal,
  articles,
  onInsertBlock,
  onExit,
}: Props) => {
  const { t } = useTranslation();

  const [showAddExternal, setShowAddExternal] = useState(false);
  const [tempId, setTempId] = useState<string | undefined>(undefined);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const toggleAddExternal = () => {
    setShowAddExternal(prevState => !prevState);
  };

  const searchForArticles = async (query: string, page: number | undefined) => {
    return search({
      query,
      page,
      'context-types': 'standard, topic-article',
    });
  };

  const onDragEnd = (a: DropResult) => {
    if (!a.destination) {
      return;
    }
    const toIndex = a.destination.index;
    const fromIndex = a.source.index;
    const newArticles = [...articles];

    const element = newArticles[fromIndex];
    newArticles.splice(fromIndex, 1);
    newArticles.splice(toIndex, 0, element);
    updateArticles(newArticles);
  };

  const openExternalEdit = (article: ExternalArticle) => {
    setTempId(article.tempId);
    setUrl(article.url);
    setTitle(article.title);
    toggleAddExternal();
  };

  const deleteRelatedArticle = (e: MouseEvent<HTMLButtonElement>, articleKey: string) => {
    e.stopPropagation();

    const newArticles = articles.filter(filterArticle =>
      'url' in filterArticle
        ? filterArticle.tempId !== articleKey
        : filterArticle.id !== articleKey,
    );
    updateArticles(newArticles);
  };

  const onAddExternal = (title: string, url: string) => {
    if (tempId) {
      updateArticles(
        articles.map(a => ('url' in a && a.tempId === tempId ? { ...a, url, title } : a)),
      );
      setTempId(undefined);
      setUrl('');
      setTitle('');
    } else {
      insertExternal(url, title);
    }
  };

  const onCloseExternalEdit = () => {
    setTempId(undefined);
    setUrl('');
    setTitle('');
    toggleAddExternal();
  };

  return (
    <StyledContainer contentEditable={false}>
      <Overlay onExit={onExit} />
      <StyledBorderDiv>
        <HeadingWrapper>
          <SectionHeading className="c-related-articles__component-title" headingLevel="h3">
            {t('form.related.title')}
          </SectionHeading>
          <Tooltip tooltip={t('form.remove')}>
            <IconButtonV2
              aria-label={t('form.remove')}
              variant="ghost"
              colorTheme="danger"
              onClick={onRemoveClick}>
              <DeleteForever />
            </IconButtonV2>
          </Tooltip>
        </HeadingWrapper>
        <p>{t('form.related.subtitle')}</p>
        <StyledListWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="relatedArticleDroppable">
              {(provided, snapshot) => (
                <StyledDropZone
                  ref={provided.innerRef}
                  className={snapshot.isDraggingOver ? 'drop-zone dragging' : 'drop-zone'}>
                  {articles.map((article, index) => {
                    if (!article) {
                      return null;
                    }
                    const articleKey = 'url' in article ? article.tempId : article.id;
                    return (
                      <Draggable key={articleKey} draggableId={articleKey} index={index}>
                        {(providedInner, snapshotInner) => (
                          <div
                            className="drag-item"
                            ref={providedInner.innerRef}
                            {...providedInner.dragHandleProps}
                            {...providedInner.draggableProps}>
                            <StyledArticle key={article.id}>
                              <RelatedArticle item={article} />
                              <ButtonWrapper>
                                {'url' in article && (
                                  <Tooltip
                                    tooltip={t('form.content.relatedArticle.changeExternal')}>
                                    <IconButtonV2
                                      aria-label={t('form.content.relatedArticle.changeExternal')}
                                      variant="ghost"
                                      colorTheme="light"
                                      onClick={() => openExternalEdit(article)}>
                                      <Pencil />
                                    </IconButtonV2>
                                  </Tooltip>
                                )}
                                <Tooltip tooltip={t('form.content.relatedArticle.removeExternal')}>
                                  <IconButtonV2
                                    aria-label={t('form.content.relatedArticle.removeExternal')}
                                    variant="ghost"
                                    colorTheme="danger"
                                    onClick={e => deleteRelatedArticle(e, articleKey)}>
                                    <DeleteForever />
                                  </IconButtonV2>
                                </Tooltip>
                              </ButtonWrapper>
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
        <div data-cy="styled-article-modal">
          <AsyncDropdown
            idField="id"
            labelField="title"
            placeholder={t('form.content.relatedArticle.placeholder')}
            apiAction={searchForArticles}
            onClick={e => e.stopPropagation()}
            onChange={selected => selected && onInsertBlock(selected.id.toString())}
            positionAbsolute
            showPagination
          />
          <StyledOr>{t('taxonomy.or')}</StyledOr>
          <ButtonV2 data-testid="showAddExternal" onClick={toggleAddExternal}>
            {t('form.content.relatedArticle.addExternal')}
          </ButtonV2>
        </div>
      </StyledBorderDiv>
      {showAddExternal && (
        <ContentLink
          onAddLink={onAddExternal}
          onClose={onCloseExternalEdit}
          initialTitle={title}
          initialUrl={url}
        />
      )}
    </StyledContainer>
  );
};

export default EditRelated;
