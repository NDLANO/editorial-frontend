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
import { RelatedContentEmbed, SectionHeading } from '@ndla/ui';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { RelatedContentEmbedData, RelatedContentMetaData } from '@ndla/types-embed';
import { DragEndEvent } from '@dnd-kit/core';
import { search } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../Overlay';
import ContentLink from '../../../../containers/ArticlePage/components/ContentLink';
import DndList from '../../../DndList';

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
  z-index: 3;
`;

const StyledOr = styled('div')`
  margin: 10px 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
`;

const RelatedArticleWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  width: 100%;
  & > article {
    flex: 1;
    max-width: 100%;
  }
`;

interface Props {
  onRemoveClick: (e: MouseEvent<HTMLButtonElement>) => void;
  updateArticles: (newEmbeds: RelatedContentMetaData[]) => void;
  onExit: () => void;
  embeds: RelatedContentMetaData[];
  onInsertBlock: (articleId: string) => void;
  insertExternal: (url: string, title: string) => Promise<void>;
}

const EditRelated = ({
  onRemoveClick,
  updateArticles,
  insertExternal,
  embeds,
  onInsertBlock,
  onExit,
}: Props) => {
  const { t } = useTranslation();
  const [externalToEdit, setExternalToEdit] = useState<RelatedContentMetaData | undefined>(
    undefined,
  );
  const [showAddExternal, setShowAddExternal] = useState(false);

  const toggleAddExternal = () => {
    setShowAddExternal((prevState) => !prevState);
  };

  const searchForArticles = async (query: string, page: number | undefined) => {
    return search({
      query,
      page,
      'context-types': 'standard, topic-article',
    });
  };

  const onDragEnd = (_event: DragEndEvent, items: RelatedContentMetaData[]) => {
    updateArticles(items);
  };

  const deleteRelatedArticle = (
    e: MouseEvent<HTMLButtonElement>,
    deleteEmbed: RelatedContentMetaData,
  ) => {
    e.stopPropagation();
    const newEmbeds = embeds.filter((embed) => embed.seq !== deleteEmbed.seq);
    updateArticles(newEmbeds);
  };

  const onExternalEdit = (editEmbed: RelatedContentMetaData, title: string, url: string) => {
    const newEmbedData: RelatedContentEmbedData = {
      ...editEmbed.embedData,
      title,
      url,
    };
    const newEmbed: RelatedContentMetaData = {
      ...editEmbed,
      embedData: newEmbedData,
    };
    const newEmbeds = embeds.map((embed) => (editEmbed.seq === embed.seq ? newEmbed : embed));
    updateArticles(newEmbeds);
  };

  const onCloseExternalEdit = () => {
    setExternalToEdit(undefined);
    setShowAddExternal(false);
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
              data-cy="close-related-button"
              aria-label={t('form.remove')}
              variant="ghost"
              colorTheme="danger"
              onClick={onRemoveClick}
            >
              <DeleteForever />
            </IconButtonV2>
          </Tooltip>
        </HeadingWrapper>
        <p>{t('form.related.subtitle')}</p>
        <DndList
          items={embeds.map((embed) => ({
            ...embed,
            id: embed.embedData.articleId || embed.embedData.url!,
          }))}
          onDragEnd={onDragEnd}
          renderItem={(embed) => (
            <RelatedArticleWrapper>
              <RelatedContentEmbed embed={embed} />
              <ButtonWrapper>
                {!embed.embedData.articleId && (
                  <Tooltip tooltip={t('form.content.relatedArticle.changeExternal')}>
                    <IconButtonV2
                      aria-label={t('form.content.relatedArticle.changeExternal')}
                      variant="ghost"
                      colorTheme="light"
                      onClick={() => {
                        setExternalToEdit(embed);
                        setShowAddExternal(true);
                      }}
                    >
                      <Pencil />
                    </IconButtonV2>
                  </Tooltip>
                )}
                <Tooltip tooltip={t('form.content.relatedArticle.removeExternal')}>
                  <IconButtonV2
                    aria-label={t('form.content.relatedArticle.removeExternal')}
                    variant="ghost"
                    colorTheme="danger"
                    onClick={(e) => deleteRelatedArticle(e, embed)}
                  >
                    <DeleteForever />
                  </IconButtonV2>
                </Tooltip>
              </ButtonWrapper>
            </RelatedArticleWrapper>
          )}
        />
        <div data-cy="styled-article-modal">
          <AsyncDropdown
            clearInputField
            idField="id"
            labelField="title"
            placeholder={t('form.content.relatedArticle.placeholder')}
            apiAction={searchForArticles}
            onClick={(e) => e.stopPropagation()}
            onChange={(selected) => selected && onInsertBlock(selected.id.toString())}
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
          onAddLink={(title, url) => {
            if (externalToEdit) {
              onExternalEdit(externalToEdit, title, url);
            }
            insertExternal(title, url);
          }}
          onClose={onCloseExternalEdit}
          initialTitle={externalToEdit?.embedData.title}
          initialUrl={externalToEdit?.embedData.url}
        />
      )}
    </StyledContainer>
  );
};

export default EditRelated;
