/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import { PencilFill, DeleteBinLine } from "@ndla/icons";
import {
  ComboboxLabel,
  DialogBody,
  DialogHeader,
  DialogTitle,
  IconButton,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { RelatedContentEmbedData, RelatedContentMetaData } from "@ndla/types-embed";
import { RelatedContentEmbed } from "@ndla/ui";
import ContentLink from "../../../../containers/ArticlePage/components/ContentLink";
import { useSearch } from "../../../../modules/search/searchQueries";
import { usePaginatedQuery } from "../../../../util/usePaginatedQuery";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../abstractions/Combobox";
import { DialogCloseButton } from "../../../DialogCloseButton";
import DndList from "../../../DndList";
import { GenericSearchCombobox } from "../../../Form/GenericSearchCombobox";

const StyledUl = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledTabsContent = styled(TabsContent, {
  base: {
    "& > div": {
      width: "100%",
    },
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const RelatedArticleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    width: "100%",
    "& > article": {
      flex: "1",
      maxWidth: "100%",
    },
  },
});

type ExternalToEdit = RelatedContentMetaData & {
  index: number;
};
interface Props {
  updateArticles: (newEmbeds: RelatedContentMetaData[]) => void;
  embeds: RelatedContentMetaData[];
  onInsertBlock: (articleId: string) => void;
  insertExternal: (url: string, title: string) => Promise<void>;
}

type TabType = "internalArticle" | "externalArticle";

const EditRelated = ({ updateArticles, insertExternal, embeds, onInsertBlock }: Props) => {
  const { t } = useTranslation();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const [currentTab, setCurrentTab] = useState<TabType>("internalArticle");
  const [externalToEdit, setExternalToEdit] = useState<ExternalToEdit | undefined>(undefined);

  const searchQuery = useSearch({
    query: delayedQuery,
    page,
    contextTypes: ["standard"],
  });

  const blockEmbeds = useMemo(() => {
    return embeds.reduce<string[]>(
      (acc, curr) => (curr.embedData.articleId ? acc.concat(curr.embedData.articleId) : acc),
      [],
    );
  }, [embeds]);

  const onTabChange = useCallback((tab: TabType) => {
    if (tab === "internalArticle") {
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
    if (!deleteEmbed.embedData.articleId && deleteEmbed.embedData.url === externalToEdit?.embedData.url) {
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
    <>
      <DialogHeader>
        <DialogTitle>{t("form.related.title")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Text>{t("form.related.subtitle")}</Text>
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
                    <IconButton
                      aria-label={t("form.content.relatedArticle.changeExternal")}
                      variant="tertiary"
                      size="small"
                      onClick={() => {
                        setExternalToEdit({ ...embed, index });
                        setCurrentTab("externalArticle");
                      }}
                      title={t("form.content.relatedArticle.changeExternal")}
                    >
                      <PencilFill />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label={t("form.content.relatedArticle.removeExternal")}
                    variant="danger"
                    size="small"
                    onClick={(e) => deleteRelatedArticle(e, embed, index)}
                    title={t("form.content.relatedArticle.removeExternal")}
                  >
                    <DeleteBinLine />
                  </IconButton>
                </ButtonWrapper>
              </RelatedArticleWrapper>
            )}
          />
        </StyledUl>
        <TabsRoot
          defaultValue="internalArticle"
          value={currentTab}
          onValueChange={(details) => onTabChange(details.value as TabType)}
          translations={{
            listLabel: t("form.content.relatedArticle.listLabel"),
          }}
        >
          <TabsList>
            <TabsTrigger value="internalArticle">{t("form.article.add")}</TabsTrigger>
            <TabsTrigger value="externalArticle">{t("form.content.relatedArticle.addExternal")}</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <StyledTabsContent value="internalArticle">
            <GenericSearchCombobox
              value={blockEmbeds}
              items={searchQuery.data?.results ?? []}
              itemToString={(item) => item.title.title}
              itemToValue={(item) => item.id.toString()}
              onValueChange={(details) => {
                onInsertBlock(details.value[0]);
              }}
              paginationData={searchQuery.data}
              inputValue={query}
              isSuccess={searchQuery.isSuccess}
              onInputValueChange={(details) => setQuery(details.inputValue)}
              onPageChange={(details) => setPage(details.page)}
              closeOnSelect={false}
              selectionBehavior="preserve"
              renderItem={(item) => (
                <GenericComboboxItemContent
                  title={item.title.title}
                  description={item.metaDescription?.metaDescription}
                  image={item.metaImage}
                  useFallbackImage
                />
              )}
            >
              <ComboboxLabel>{t("form.article.add")}</ComboboxLabel>
              <GenericComboboxInput
                placeholder={t("form.content.relatedArticle.placeholder")}
                isFetching={searchQuery.isFetching}
              />
            </GenericSearchCombobox>
          </StyledTabsContent>
          <TabsContent value="externalArticle">
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
          </TabsContent>
        </TabsRoot>
      </DialogBody>
    </>
  );
};

export default EditRelated;
