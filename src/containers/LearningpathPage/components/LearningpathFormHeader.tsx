/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@ndla/primitives";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ContentTypeBadge } from "@ndla/ui";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import HeaderFavoriteStatus from "../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import { ResourcePublishedLink } from "../../../components/HeaderWithLanguage/ResourcePublishedLink";
import { PUBLISHED } from "../../../constants";
import { usePostCopyLearningpathMutation } from "../../../modules/learningpath/learningpathMutations";
import { routes } from "../../../util/routeHelpers";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderResponsibleInfo,
  FormHeaderSegment,
  FormHeaderStatusInfo,
  FormHeaderStatusWrapper,
} from "../../FormHeader/FormHeader";

interface Props {
  learningpath: ILearningPathV2DTO | undefined;
  language: string;
}

export const LearningpathFormHeader = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!learningpath?.id && !learningpath.supportedLanguages.includes(language);
  const cloneLearningpathMutation = usePostCopyLearningpathMutation();
  const navigate = useNavigate();
  // TODO: I don't know all of the learningpath statuses. We need to ensure we have translations for all of them.
  const statusText = learningpath?.status ? t(`form.status.${learningpath.status.toLowerCase()}`) : "";

  const onClone = useCallback(async () => {
    if (!learningpath) return;
    const res = await cloneLearningpathMutation.mutateAsync({
      learningpathId: learningpath.id,
      learningpath: { title: `${learningpath.title.title}_Kopi`, language: language },
    });

    navigate(routes.learningpath.edit(res.id, language));
  }, [cloneLearningpathMutation, language, learningpath, navigate]);

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
          {/* TODO:  taxonomy */}
          <HeaderFavoriteStatus id={learningpath?.id} type="learningpath" />
          <div>
            {/* TODO: Add responsible here when supported */}
            <FormHeaderResponsibleInfo responsibleName={undefined} />
            <FormHeaderStatusInfo isNewLanguage={isNewLanguage} statusText={statusText} />
          </div>
        </FormHeaderStatusWrapper>
        {/* TODO: Published status, taxonomy, favorite count, responsible and status */}
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
