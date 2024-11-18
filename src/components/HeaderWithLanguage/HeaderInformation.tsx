/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { List } from "@ndla/icons/action";
import { Podcast } from "@ndla/icons/common";
import { Camera, Concept, Taxonomy, SquareAudio, Globe } from "@ndla/icons/editor";
import { Button, Heading } from "@ndla/primitives";
import { ContentTypeBadge, constants } from "@ndla/ui";
import HeaderStatusInformation from "./HeaderStatusInformation";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { fetchAuth0Users } from "../../modules/auth0/auth0Api";
import * as draftApi from "../../modules/draft/draftApi";
import handleError from "../../util/handleError";
import { toEditArticle } from "../../util/routeHelpers";
import { Plain } from "../../util/slatePlainSerializer";
import Spinner from "../Spinner";

export const StyledSplitter = styled.div`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0 ${spacing.xsmall};
  margin: ${spacing.normal} 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.light};
`;

const StyledTitleHeaderWrapper = styled.div`
  padding-left: ${spacing.small};
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const { contentTypes } = constants;

const types: Record<string, { form: string; icon: ReactNode }> = {
  standard: {
    form: "learningResourceForm",
    icon: <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="small" />,
  },
  "topic-article": {
    form: "topicArticleForm",
    icon: <ContentTypeBadge type={contentTypes.TOPIC} background size="small" />,
  },
  subjectpage: {
    form: "subjectpageForm",
    icon: <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />,
  },
  "frontpage-article": {
    form: "frontpageArticleForm",
    icon: <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />,
  },
  image: { form: "imageForm", icon: <Camera /> },
  audio: {
    form: "audioForm",
    icon: <SquareAudio />,
  },
  podcast: {
    form: "podcastForm",
    icon: <Podcast />,
  },
  "podcast-series": {
    form: "podcastSeriesForm",
    icon: <List />,
  },
  concept: {
    form: "conceptForm",
    icon: <Concept />,
  },
  gloss: {
    form: "glossform",
    icon: <Globe />,
  },
  programme: {
    form: "programmepageForm",
    icon: <Taxonomy />,
  },
};

interface Props {
  noStatus: boolean;
  statusText?: string;
  published?: boolean;
  type: string;
  isNewLanguage: boolean;
  title?: string;
  formIsDirty?: boolean;
  multipleTaxonomy?: boolean;
  id?: number;
  language: string;
  setHasConnections?: (hasConnections: boolean) => void;
  expirationDate?: string;
  responsibleId?: string;
  hasRSS?: boolean;
  slug?: string;
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
  multipleTaxonomy,
  setHasConnections,
  expirationDate,
  responsibleId,
  hasRSS,
  language,
  slug,
}: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();
  const [responsibleName, setResponsibleName] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!responsibleId) return;
      const userData = await fetchAuth0Users(responsibleId);
      userData.length && setResponsibleName(userData[0].name);
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
    <StyledHeader>
      <StyledTitleHeaderWrapper>
        {types[type].icon}
        {type === "gloss" && title ? (
          <GlossTitle />
        ) : (
          <Heading textStyle="title.medium">{`${t(`${types[type].form}.title`)}${title ? `: ${title}` : ""}`}</Heading>
        )}
        {(type === "standard" || type === "topic-article") && (
          <Button size="small" variant="tertiary" onClick={onSaveAsNew} data-testid="saveAsNew">
            {t("form.workflow.saveAsNew")}
            {loading && <Spinner appearance="absolute" />}
          </Button>
        )}
      </StyledTitleHeaderWrapper>
      <HeaderStatusInformation
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        published={published}
        slug={slug}
        multipleTaxonomy={multipleTaxonomy}
        type={type}
        id={id}
        setHasConnections={setHasConnections}
        expirationDate={expirationDate}
        responsibleName={responsibleName}
        hasRSS={hasRSS}
      />
    </StyledHeader>
  );
};

const GlossTitle = () => {
  const { t } = useTranslation();
  const [, titleField] = useField("title");
  const [, targetLanguageField] = useField("gloss.gloss");

  return (
    <Heading textStyle="title.medium">
      {`${t(`${types["gloss"].form}.title`)}: ${Plain.serialize(titleField.value)}${
        targetLanguageField.value ? `/${targetLanguageField.value}` : ""
      }`}
    </Heading>
  );
};

export default memo(HeaderInformation);
