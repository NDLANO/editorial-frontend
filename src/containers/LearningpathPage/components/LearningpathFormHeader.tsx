/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { ErrorWarningFill } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ContentTypeBadge } from "@ndla/ui";
import DeleteLanguageVersion from "../../../components/HeaderWithLanguage/DeleteLanguageVersion";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import LanguagePicker from "../../../components/HeaderWithLanguage/HeaderLanguagePicker";
import HeaderSupportedLanguages from "../../../components/HeaderWithLanguage/HeaderSupportedLanguages";
import { ResourcePublishedLink } from "../../../components/HeaderWithLanguage/ResourcePublishedLink";
import { ResourceStatus } from "../../../components/HeaderWithLanguage/ResourceStatus";
import { PUBLISHED, UNLISTED } from "../../../constants";
import { useAuth0Users } from "../../../modules/auth0/auth0Queries";
import { usePostCopyLearningpathMutation } from "../../../modules/learningpath/learningpathMutations";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { getExpirationDate } from "../../../util/revisionHelpers";
import { CreatingLanguageLocationState, routes, toLearningpath } from "../../../util/routeHelpers";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderResponsibleInfo,
  FormHeaderSegment,
  FormHeaderStatusInfo,
  FormHeaderStatusWrapper,
} from "../../FormHeader/FormHeader";
import { useMessages } from "../../Messages/MessagesProvider";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  learningpath: ILearningPathV2DTO | undefined;
  language: string;
}

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const StyledGroup = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

export const LearningpathFormHeader = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!learningpath?.id && !learningpath.supportedLanguages.includes(language);
  const cloneLearningpathMutation = usePostCopyLearningpathMutation();
  const { dirty } = useFormikContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { createMessage } = useMessages();
  const { taxonomyVersion } = useTaxonomyVersion();
  const responsibleQuery = useAuth0Users(
    { uniqueUserIds: learningpath?.responsible?.responsibleId ?? "" },
    { enabled: !!learningpath?.responsible?.responsibleId },
  );
  const statusText = learningpath?.status ? t(`form.status.${learningpath.status.toLowerCase()}`) : "";
  const expirationDate = getExpirationDate(learningpath?.revisions);

  const taxonomyQuery = useNodes(
    {
      contentURI: `urn:learningpath:${learningpath?.id}`,
      taxonomyVersion,
      language,
      includeContexts: true,
      filterProgrammes: true,
    },
    { enabled: !!learningpath },
  );

  const languages = useMemo(() => {
    return [
      { key: "nn", title: t("languages.nn"), include: true },
      { key: "en", title: t("languages.en"), include: true },
      { key: "nb", title: t("languages.nb"), include: true },
      { key: "sma", title: t("languages.sma"), include: true },
      { key: "se", title: t("languages.se"), include: true },
      { key: "und", title: t("languages.und"), include: false },
      { key: "de", title: t("languages.de"), include: true },
      { key: "es", title: t("languages.es"), include: true },
      { key: "zh", title: t("languages.zh"), include: true },
      { key: "ukr", title: t("languages.ukr"), include: true },
    ];
  }, [t]);

  const emptyLanguages = useMemo(
    () =>
      languages.filter(
        (lang) => lang.key !== language && !learningpath?.supportedLanguages.includes(lang.key) && lang.include,
      ),
    [language, languages, learningpath],
  );

  const contexts = useMemo(() => {
    return (
      taxonomyQuery.data?.flatMap((node) => node.contexts).filter((context) => !context.rootId.includes("programme")) ??
      []
    );
  }, [taxonomyQuery.data]);

  const onClone = useCallback(async () => {
    if (!learningpath) return;
    if (dirty || !learningpath.supportedLanguages.includes(language)) {
      createMessage({ translationKey: "form.mustSaveFirst", severity: "danger", timeToLive: 0 });
      return;
    }
    const res = await cloneLearningpathMutation.mutateAsync({
      learningpathId: learningpath.id,
      learningpath: { title: `${learningpath.title.title}_Kopi`, language: language },
    });

    navigate(routes.learningpath.edit(res.id, language));
  }, [cloneLearningpathMutation, createMessage, dirty, language, learningpath, navigate]);

  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <ContentTypeBadge contentType="learning-path" />
          <FormHeaderHeading contentType="learning-path">{learningpath?.title.title}</FormHeaderHeading>
          {!!learningpath && (
            <Button loading={cloneLearningpathMutation.isPending} variant="tertiary" size="small" onClick={onClone}>
              {t("learningpathForm.header.clone")}
            </Button>
          )}
        </FormHeaderHeadingContainer>
        <FormHeaderStatusWrapper>
          {(learningpath?.status === PUBLISHED || learningpath?.status === UNLISTED) && (
            <ResourcePublishedLink type="learningpath" slugOrId={learningpath.id} />
          )}
          {!!expirationDate && <ResourceStatus expirationDate={expirationDate} />}
          {contexts.length > 1 && (
            <StyledErrorWarningFill
              aria-label={t("form.workflow.multipleTaxonomy")}
              title={t("form.workflow.multipleTaxonomy")}
              aria-hidden={false}
            />
          )}
          <HeaderFavoriteStatus id={learningpath?.id} type="learningpath" />
          <div>
            <FormHeaderResponsibleInfo responsibleName={responsibleQuery.data?.[0]?.name} />
            <FormHeaderStatusInfo isNewLanguage={isNewLanguage} statusText={statusText} />
          </div>
        </FormHeaderStatusWrapper>
      </FormHeaderSegment>
      <StyledWrapper>
        {!!learningpath?.id && (
          <StyledGroup>
            <HeaderSupportedLanguages
              id={learningpath.id}
              editUrl={toLearningpath}
              language={language}
              supportedLanguages={learningpath.supportedLanguages}
            />
            {!!(location.state as CreatingLanguageLocationState)?.isCreatingLanguage &&
              !learningpath.supportedLanguages.includes(language) && (
                <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
              )}
            {!!learningpath && (
              <LanguagePicker id={learningpath.id} editUrl={toLearningpath} emptyLanguages={emptyLanguages} />
            )}
          </StyledGroup>
        )}
        {!!learningpath?.id && (
          <DeleteLanguageVersion
            id={learningpath.id}
            language={language}
            supportedLanguages={learningpath.supportedLanguages}
            type="learningpath"
            disabled={learningpath.supportedLanguages.length === 1}
          />
        )}
      </StyledWrapper>
    </header>
  );
};
