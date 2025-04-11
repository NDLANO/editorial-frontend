/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { TaxonomyContext } from "@ndla/types-taxonomy";
import { ContentTypeBadge, constants } from "@ndla/ui";
import { CloneImageDialog } from "./CloneImageDialog";
import HeaderStatusInformation from "./HeaderStatusInformation";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { fetchAuth0Users } from "../../modules/auth0/auth0Api";
import * as draftApi from "../../modules/draft/draftApi";
import handleError from "../../util/handleError";
import { getContentTypeFromResourceTypes } from "../../util/resourceHelpers";
import { toEditArticle } from "../../util/routeHelpers";
import { Plain } from "../../util/slatePlainSerializer";
import { SegmentHeader } from "../Form/SegmentHeader";

const StyledSegmentHeader = styled(SegmentHeader, {
  base: {
    paddingBlock: "3xsmall",
    marginBlock: "xsmall",
  },
});

export const StyledSplitter = styled("div", {
  base: {
    width: "1px",
    background: "stroke.default",
    height: "medium",
    marginInline: "3xsmall",
  },
});

const StyledTitleHeaderWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "3xsmall",
  },
});

const { contentTypes } = constants;

const contentTypeMapping: Record<string, string> = {
  standard: contentTypes.SUBJECT_MATERIAL,
  "topic-article": contentTypes.TOPIC,
  subjectpage: contentTypes.SUBJECT,
  "frontpage-article": "frontpage-article",
  filmfrontpage: contentTypes.SUBJECT,
  image: "image",
  audio: "audio",
  podcast: "podcast",
  "podcast-series": "podcast-series",
  concept: "concept",
  gloss: "gloss",
  programme: "programme",
};

interface Props {
  noStatus: boolean;
  statusText?: string;
  published?: boolean;
  type: string;
  isNewLanguage: boolean;
  title?: string;
  formIsDirty?: boolean;
  id?: number;
  language: string;
  setHasConnections?: (hasConnections: boolean) => void;
  expirationDate?: string;
  responsibleId?: string;
  hasRSS?: boolean;
  slug?: string;
  taxonomy?: TaxonomyContext[];
}

const HeaderInformation = ({
  type,
  noStatus,
  id,
  statusText,
  published = false,
  isNewLanguage,
  title,
  formIsDirty,
  setHasConnections,
  expirationDate,
  responsibleId,
  hasRSS,
  language,
  slug,
  taxonomy = [],
}: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();
  const [responsibleName, setResponsibleName] = useState<string | undefined>(undefined);

  const contentType = taxonomy[0]?.resourceTypes.length
    ? getContentTypeFromResourceTypes(taxonomy[0].resourceTypes)
    : contentTypeMapping[type];

  useEffect(() => {
    (async () => {
      if (!responsibleId) return;
      const userData = await fetchAuth0Users(responsibleId);
      if (userData.length) {
        setResponsibleName(userData[0].name);
      }
    })();
  }, [responsibleId]);

  const onSaveAsNew = useCallback(async () => {
    if (!id) return;
    try {
      if (formIsDirty) {
        createMessage({
          translationKey: "form.mustSaveFirst",
          severity: "danger",
          timeToLive: 0,
        });
      } else {
        setLoading(true);
        const newArticle = await draftApi.cloneDraft(id, language);
        // we don't set loading to false as the redirect will unmount this component anyway
        navigate(toEditArticle(newArticle.id, newArticle.articleType, language));
      }
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  }, [createMessage, formIsDirty, id, language, navigate]);

  return (
    <StyledSegmentHeader>
      <StyledTitleHeaderWrapper>
        <ContentTypeBadge contentType={contentType ?? contentTypes.SUBJECT_MATERIAL} />
        {type === "gloss" && title ? (
          <GlossTitle />
        ) : (
          <Heading textStyle="title.medium">
            {title ?? t("form.createNew", { type: t(`contentTypes.${type}`) })}
          </Heading>
        )}
        {(type === "standard" || type === "topic-article") && id ? (
          <Button size="small" variant="tertiary" onClick={onSaveAsNew} data-testid="saveAsNew" loading={loading}>
            {t("form.workflow.saveAsNew")}
          </Button>
        ) : null}
        {type === "image" && id ? <CloneImageDialog imageId={id} loading={loading} /> : null}
      </StyledTitleHeaderWrapper>
      <HeaderStatusInformation
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        published={published}
        slug={slug}
        multipleTaxonomy={taxonomy.length > 1}
        type={type}
        id={id}
        setHasConnections={setHasConnections}
        expirationDate={expirationDate}
        responsibleName={responsibleName}
        hasRSS={hasRSS}
      />
    </StyledSegmentHeader>
  );
};

const GlossTitle = () => {
  const { t } = useTranslation();
  const [, titleField] = useField("title");
  const [, targetLanguageField] = useField("gloss.gloss");

  return (
    <Heading textStyle="title.medium">
      {`${t("glossform.title")}: ${Plain.serialize(titleField.value)}${
        targetLanguageField.value ? `/${targetLanguageField.value}` : ""
      }`}
    </Heading>
  );
};

export default memo(HeaderInformation);
