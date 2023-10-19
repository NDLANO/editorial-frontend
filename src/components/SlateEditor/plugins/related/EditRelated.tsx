/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, MouseEvent, forwardRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { RelatedContentEmbed, SectionHeading } from '@ndla/ui';
import Tooltip from '@ndla/tooltip';
import { Pencil } from '@ndla/icons/action';
import { colors, spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { RelatedContentEmbedData, RelatedContentMetaData } from '@ndla/types-embed';
import { DragEndEvent } from '@dnd-kit/core';
import { Content } from '@radix-ui/react-popover';
import Tabs from '@ndla/tabs';
import { search } from '../../../../modules/search/searchApi';
import AsyncDropdown from '../../../Dropdown/asyncDropdown/AsyncDropdown';
import DndList from '../../../DndList';
import ContentLink from '../../../../containers/ArticlePage/components/ContentLink';

const StyledUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBorderDiv = styled(Content)`
  width: 600px;
  border: 2px solid ${colors.brand.tertiary};
  padding: ${spacing.large};
  padding-top: 0;
  background-color: ${colors.white};
  max-height: 1100px;
  overflow-y: scroll;
  z-index: 5;
`;

const StyledTabs = styled(Tabs)`
  [data-tab-panel] {
    padding: ${spacing.normal} 0;
  }
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

type ExternalToEdit = RelatedContentMetaData & {
  index: number;
};
interface Props extends HTMLAttributes<HTMLDivElement> {
  onRemoveClick: (e: MouseEvent<HTMLButtonElement>) => void;
  updateArticles: (newEmbeds: RelatedContentMetaData[]) => void;
  embeds: RelatedContentMetaData[];
  onInsertBlock: (articleId: string) => void;
  insertExternal: (url: string, title: string) => Promise<void>;
}

type TabType = 'internalArticle' | 'externalArticle';

const EditRelated = forwardRef<HTMLDivElement, Props>(
  ({ onRemoveClick, updateArticles, insertExternal, embeds, onInsertBlock, ...rest }, ref) => {
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState<TabType>('internalArticle');
    const [externalToEdit, setExternalToEdit] = useState<ExternalToEdit | undefined>(undefined);

    const searchForArticles = async (query: string, page: number | undefined) => {
      return search({
        query,
        page,
        'context-types': 'standard',
      });
    };

    const onTabChange = useCallback((tab: TabType) => {
      if (tab === 'internalArticle') {
        setExternalToEdit(undefined);
      }
      setCurrentTab(tab);
    }, []);

    const onDragEnd = (_event: DragEndEvent, items: RelatedContentMetaData[]) => {
      updateArticles(items);
    };

    const deleteRelatedArticle = (
      e: MouseEvent<HTMLButtonElement>,
      deleteEmbed: RelatedContentMetaData,
      index: number,
    ) => {
      e.stopPropagation();
      if (
        !deleteEmbed.embedData.articleId &&
        deleteEmbed.embedData.url === externalToEdit?.embedData.url
      ) {
        setExternalToEdit(undefined);
      }
      const newEmbeds = embeds.filter((_, idx) => index !== idx);
      updateArticles(newEmbeds);
    };

    const onExternalEdit = (editEmbed: ExternalToEdit, title: string, url: string) => {
      const newEmbedData: RelatedContentEmbedData = {
        ...editEmbed.embedData,
        title,
        url,
      };
      const newEmbed: RelatedContentMetaData = {
        ...editEmbed,
        embedData: newEmbedData,
      };
      const newEmbeds = embeds.map((embed, idx) => (idx === editEmbed.index ? newEmbed : embed));
      updateArticles(newEmbeds);
    };

    return (
      <StyledBorderDiv {...rest} sticky="always" avoidCollisions={false} ref={ref}>
        <HeadingWrapper>
          <SectionHeading className="c-related-articles__component-title" headingLevel="h3">
            {t('form.related.title')}
          </SectionHeading>
          <Tooltip tooltip={t('form.remove')}>
            <IconButtonV2
              data-testid="close-related-button"
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
        <StyledUl>
          <DndList
            items={embeds.map((embed, index) => ({
              ...embed,
              id: index + 1,
            }))}
            disabled={embeds.length < 2}
            onDragEnd={onDragEnd}
            renderItem={(embed, index) => (
              <RelatedArticleWrapper key={index}>
                <RelatedContentEmbed embed={embed} />
                <ButtonWrapper>
                  {!embed.embedData.articleId && (
                    <Tooltip tooltip={t('form.content.relatedArticle.changeExternal')}>
                      <IconButtonV2
                        aria-label={t('form.content.relatedArticle.changeExternal')}
                        variant="ghost"
                        colorTheme="light"
                        onClick={() => {
                          setExternalToEdit({ ...embed, index });
                          setCurrentTab('externalArticle');
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
                      onClick={(e) => deleteRelatedArticle(e, embed, index)}
                    >
                      <DeleteForever />
                    </IconButtonV2>
                  </Tooltip>
                </ButtonWrapper>
              </RelatedArticleWrapper>
            )}
          />
        </StyledUl>
        <StyledTabs
          variant="underlined"
          value={currentTab}
          onValueChange={(val) => onTabChange(val as TabType)}
          tabs={[
            {
              title: t('form.article.add'),
              id: 'internalArticle',
              content: (
                <AsyncDropdown
                  clearInputField
                  idField="id"
                  labelField="title"
                  placeholder={t('form.content.relatedArticle.placeholder')}
                  apiAction={searchForArticles}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(selected) => selected && onInsertBlock(selected.id.toString())}
                  showPagination
                />
              ),
            },
            {
              title: t('form.content.relatedArticle.addExternal'),
              id: 'externalArticle',
              content: (
                <ContentLink
                  onAddLink={(title, url) => {
                    if (externalToEdit) {
                      onExternalEdit(externalToEdit, title, url);
                    } else {
                      insertExternal(title, url);
                    }
                    setExternalToEdit(undefined);
                  }}
                  initialTitle={externalToEdit?.embedData.title}
                  initialUrl={externalToEdit?.embedData.url}
                />
              ),
            },
          ]}
        />
      </StyledBorderDiv>
    );
  },
);

export default EditRelated;
