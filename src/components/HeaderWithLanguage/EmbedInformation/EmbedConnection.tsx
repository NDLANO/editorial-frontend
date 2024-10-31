/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { SubjectMaterial } from "@ndla/icons/contentType";
import { ModalHeader, ModalCloseButton, ModalBody, Modal, ModalTitle, ModalTrigger, ModalContent } from "@ndla/modal";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { postSearchConcepts } from "../../../modules/concept/conceptApi";
import { postSearch } from "../../../modules/search/searchApi";
import { routes } from "../../../util/routeHelpers";
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

const ImageInformationIcon = styled(SubjectMaterial)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

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
      (type === "image" || type === "audio") &&
        postSearchConcepts(searchObjects(id, type)).then((result) => {
          if (shouldUpdateState) setConcepts?.(result.results);
        });
    }

    return () => {
      shouldUpdateState = false;
    };
  }, [id, type, setArticles, setConcepts]);

  if (!articles?.length && !concepts?.length) {
    return null;
  }

  return (
    <Modal>
      <ModalTrigger>
        <ButtonV2
          variant="stripped"
          aria-label={t(`form.embedConnections.info.${type}`)}
          title={t(`form.embedConnections.info.${type}`)}
        >
          <ImageInformationIcon />
        </ButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t("form.embedConnections.title", {
              resource: t(`form.embedConnections.type.${type}`),
            })}
          </ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>
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
          </p>
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
              <p>
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
              </p>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmbedConnection;
