/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ErrorWarningFill } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ContentTypeBadge } from "@ndla/ui";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import { ResourcePublishedLink } from "../../../components/HeaderWithLanguage/ResourcePublishedLink";
import { PUBLISHED } from "../../../constants";
import { usePostCopyLearningpathMutation } from "../../../modules/learningpath/learningpathMutations";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { routes } from "../../../util/routeHelpers";
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
  enableClone?: boolean;
}

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

export const LearningpathFormHeader = ({ learningpath, language, enableClone }: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!learningpath?.id && !learningpath.supportedLanguages.includes(language);
  const cloneLearningpathMutation = usePostCopyLearningpathMutation();
  const navigate = useNavigate();
  const { createMessage } = useMessages();
  const { taxonomyVersion } = useTaxonomyVersion();
  // TODO: I don't know all of the learningpath statuses. We need to ensure we have translations for all of them.
  const statusText = learningpath?.status ? t(`form.status.${learningpath.status.toLowerCase()}`) : "";

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

  const contexts = useMemo(() => {
    return (
      taxonomyQuery.data?.flatMap((node) => node.contexts).filter((context) => !context.rootId.includes("programme")) ??
      []
    );
  }, [taxonomyQuery.data]);

  const onClone = useCallback(async () => {
    if (!learningpath) return;
    if (!enableClone) {
      createMessage({ translationKey: "form.mustSaveFirst", severity: "danger", timeToLive: 0 });
      return;
    }
    const res = await cloneLearningpathMutation.mutateAsync({
      learningpathId: learningpath.id,
      learningpath: { title: `${learningpath.title.title}_Kopi`, language: language },
    });

    navigate(routes.learningpath.edit(res.id, language));
  }, [cloneLearningpathMutation, createMessage, enableClone, language, learningpath, navigate]);

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
          {learningpath?.status === PUBLISHED && (
            <ResourcePublishedLink type="learningpath" slugOrId={learningpath.id} />
          )}
          {/* TODO: Revision */}
          {contexts.length > 1 && (
            <StyledErrorWarningFill
              aria-label={t("form.workflow.multipleTaxonomy")}
              title={t("form.workflow.multipleTaxonomy")}
              aria-hidden={false}
            />
          )}
          <HeaderFavoriteStatus id={learningpath?.id} type="learningpath" />
          <div>
            {/* TODO: Add responsible here when supported */}
            <FormHeaderResponsibleInfo responsibleName={undefined} />
            <FormHeaderStatusInfo isNewLanguage={isNewLanguage} statusText={statusText} />
          </div>
        </FormHeaderStatusWrapper>
      </FormHeaderSegment>
      {learningpath?.id ? (
        <HeaderActions
          id={learningpath.id}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={learningpath.supportedLanguages}
          disableDelete={learningpath.supportedLanguages.length === 1}
          noStatus
          isNewLanguage={isNewLanguage}
          type="learningpath"
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};
