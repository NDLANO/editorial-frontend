/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SubjectMaterial } from "@ndla/icons/contentType";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Text,
} from "@ndla/primitives";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { postSearchConcepts } from "../../../modules/concept/conceptApi";
import { postSearch } from "../../../modules/search/searchApi";
import { routes } from "../../../util/routeHelpers";
import { DialogCloseButton } from "../../DialogCloseButton";
import ListResource from "../../Form/ListResource";

type EmbedType = "image" | "audio" | "concept" | "gloss" | "article";

interface Props {
  id?: number;
  type: EmbedType;
  articles: IMultiSearchSummary[];
  setArticles: (articles: IMultiSearchSummary[]) => void;
  concepts?: IConceptSummary[];
  setConcepts?: (concepts: IConceptSummary[]) => void;
}

type SearchEmbedTypes = "image" | "audio" | "concept" | "gloss" | "content-link" | "related-content";

const convertToSearchEmbedTypes = (embedType: EmbedType): SearchEmbedTypes[] => {
  switch (embedType) {
    case "article":
      return ["content-link", "related-content"];
    case "gloss":
      return ["concept"];
    default:
      return [embedType];
  }
};

const searchObjects = (embedId: number, embedType: EmbedType) => ({
  embedId: embedId.toString(),
  embedResource: convertToSearchEmbedTypes(embedType),
  pageSize: 50,
});

const EmbedConnection = ({ id, type, articles, setArticles, concepts, setConcepts }: Props) => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    let shouldUpdateState = true;
    if (id) {
      postSearch(searchObjects(id, type)).then((result) => {
        if (shouldUpdateState) setArticles(result.results);
      });
      if (type === "image" || type === "audio") {
        postSearchConcepts(searchObjects(id, type)).then((result) => {
          if (shouldUpdateState) setConcepts?.(result.results);
        });
      }
    }

    return () => {
      shouldUpdateState = false;
    };
  }, [id, type, setArticles, setConcepts]);

  if (!articles?.length && !concepts?.length) {
    return null;
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton
          size="small"
          variant="tertiary"
          aria-label={t(`form.embedConnections.info.${type}`)}
          title={t(`form.embedConnections.info.${type}`)}
        >
          <SubjectMaterial />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("form.embedConnections.title", {
              resource: t(`form.embedConnections.type.${type}`),
            })}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text>
            {t("form.embedConnections.sectionTitleArticle", {
              resource: t(`form.embedConnections.type.${type}`),
            })}{" "}
            <em>
              (
              {t("form.embedConnections.articles", {
                count: articles ? articles.length : 0,
              })}
              )
            </em>
          </Text>
          {articles.map((element) => (
            <ListResource
              key={element.id}
              title={element.title.title}
              metaImage={element.metaImage}
              url={routes.editArticle(element.id, element.learningResourceType ?? "standard", i18n.language)}
            />
          ))}
          {(type === "image" || type === "audio") && (
            <>
              <Text>
                {t("form.embedConnections.sectionTitleConcept", {
                  resource: t(`form.embedConnections.type.${type}`),
                })}{" "}
                <em>
                  (
                  {t("form.embedConnections.concepts", {
                    count: concepts ? concepts.length : 0,
                  })}
                  )
                </em>
              </Text>
              {concepts?.map((element) => (
                <ListResource
                  key={element.id}
                  title={element.title.title}
                  metaImage={element.metaImage}
                  url={
                    element.conceptType === "concept"
                      ? routes.concept.edit(element.id, i18n.language)
                      : routes.gloss.edit(element.id, i18n.language)
                  }
                />
              ))}
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EmbedConnection;
