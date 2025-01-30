/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Draggable, LinkMedium } from "@ndla/icons";
import {
  Button,
  ComboboxLabel,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO, IArticleSummaryDTO, IRelatedContentLinkDTO } from "@ndla/types-backend/draft-api";
import ContentLink from "./ContentLink";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { ConvertedRelatedContent, RelatedContent } from "../../../interfaces";
import { fetchDraft } from "../../../modules/draft/draftApi";
import { useSearchDrafts } from "../../../modules/draft/draftQueries";
import handleError from "../../../util/handleError";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledButtonWrapper = styled("div", {
  base: {
    marginBlock: "small",
  },
});

interface Props {
  field: FieldInputProps<ArticleFormType["relatedContent"]>;
}

const isDraftApiType = (relatedContent: ConvertedRelatedContent): relatedContent is IArticleDTO =>
  (relatedContent as IArticleDTO).id !== undefined;

const ContentField = ({ field }: Props) => {
  const { t, i18n } = useTranslation();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const [relatedContent, setRelatedContent] = useState<ConvertedRelatedContent[]>([]);
  const [showAddExternal, setShowAddExternal] = useState(false);

  const selectedItems = useMemo(() => relatedContent.filter(isDraftApiType), [relatedContent]);

  const searchQuery = useSearchDrafts(
    { query: delayedQuery, language: i18n.language, page },
    { placeholderData: (prev) => prev },
  );

  useEffect(() => {
    (async () => {
      const promises = field.value.map<Promise<ConvertedRelatedContent> | IRelatedContentLinkDTO>((element) => {
        if (typeof element === "number") {
          return fetchDraft(element);
        } else return element;
      });
      const content = await Promise.all(promises);
      setRelatedContent(content);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddArticleToList = async (article: IArticleSummaryDTO) => {
    try {
      if (selectedItems.some((a) => a.id === article.id)) {
        const newRelatedContent = relatedContent.filter((a) => isDraftApiType(a) && a.id !== article.id);
        setRelatedContent(newRelatedContent);
        updateFormik(field, newRelatedContent);
      } else {
        const newArticle = await fetchDraft(article.id, i18n.language);
        const newRelatedContent = relatedContent.concat(newArticle);
        setRelatedContent(newRelatedContent);
        updateFormik(field, newRelatedContent);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (relatedContent: ConvertedRelatedContent[]) => {
    setRelatedContent(relatedContent);
    updateFormik(field, relatedContent);
  };

  const onDeleteElement = (elements: ConvertedRelatedContent[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateElements(newElements);
  };

  const updateFormik = (formikField: Props["field"], newData: ConvertedRelatedContent[]) => {
    const newRc: RelatedContent[] = newData.map((rc) => (isDraftApiType(rc) ? rc.id : rc));
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newRc || null,
      },
    });
  };

  const addExternalLink = (title: string, url: string) => {
    const temp = [...relatedContent, { title, url }];
    setRelatedContent(temp);
    updateFormik(field, temp);
  };

  const releatedContentDndItems = useMemo(
    () =>
      relatedContent
        .filter(
          (rc: number | IArticleDTO | IRelatedContentLinkDTO): rc is IArticleDTO | IRelatedContentLinkDTO =>
            typeof rc !== "number",
        )
        .map((r, index) => ("id" in r ? r : { ...r, isExternal: true, id: `${r.url}_${index + 1}` })),
    [relatedContent],
  );

  return (
    <FormContent>
      <GenericSearchCombobox
        value={selectedItems.map((article) => article.id.toString())}
        closeOnSelect={false}
        selectionBehavior="preserve"
        onValueChange={(details) => onAddArticleToList(details.items[0])}
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => item.id.toString()}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => <GenericComboboxItemContent title={item.title.title} />}
      >
        <ComboboxLabel>{t("form.relatedContent.articlesTitle")}</ComboboxLabel>
        <GenericComboboxInput placeholder={t("form.relatedContent.placeholder")} isFetching={searchQuery.isFetching} />
      </GenericSearchCombobox>
      <StyledList>
        <DndList
          items={releatedContentDndItems}
          dragHandle={
            <DragHandle aria-label={t("form.relatedContent.changeOrder")}>
              <Draggable />
            </DragHandle>
          }
          renderItem={(item, index) =>
            "isExternal" in item ? (
              <ListResource
                key={item.id}
                title={item.title}
                url={item.url}
                isExternal
                fallbackElement={<LinkMedium />}
                onDelete={() => onDeleteElement(relatedContent, index)}
                removeElementTranslation={t("form.relatedContent.removeArticle")}
              />
            ) : (
              <ListResource
                key={item.id}
                title={item.title?.title}
                metaImage={item.metaImage}
                url={routes.editArticle(item.id, item.articleType ?? "standard", i18n.language)}
                onDelete={() => onDeleteElement(relatedContent, index)}
                removeElementTranslation={t("form.relatedContent.removeArticle")}
              />
            )
          }
          onDragEnd={(_, newArray) => onUpdateElements(newArray)}
        />
      </StyledList>
      <DialogRoot open={showAddExternal} onOpenChange={({ open }) => setShowAddExternal(open)}>
        <StyledButtonWrapper>
          <DialogTrigger asChild>
            <Button>{t("form.relatedContent.addExternal")}</Button>
          </DialogTrigger>
        </StyledButtonWrapper>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.content.relatedArticle.searchExternal")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <ContentLink
              onAddLink={(title, url) => {
                addExternalLink(title, url);
                setShowAddExternal(false);
              }}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </FormContent>
  );
};

export default ContentField;
