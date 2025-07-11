/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ContentTypeBadge } from "@ndla/ui";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import { FormHeaderHeading, FormHeaderHeadingContainer, FormHeaderSegment } from "../../FormHeader/FormHeader";

interface Props {
  learningpath: ILearningPathV2DTO | undefined;
  language: string;
}

export const LearningpathFormHeader = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!learningpath?.id && !learningpath.supportedLanguages.includes(language);
  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <ContentTypeBadge contentType="learning-path" />
          <FormHeaderHeading contentType="learning-path">{learningpath?.title.title}</FormHeaderHeading>
          {/* TODO: Cloning */}
        </FormHeaderHeadingContainer>
        {/* TODO: Published status, taxonomy, favorite count, responsible and status */}
      </FormHeaderSegment>
      {learningpath?.id ? (
        <HeaderActions
          id={learningpath.id}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={learningpath.supportedLanguages}
          // TODO: Can this have connections?
          disableDelete={learningpath.supportedLanguages.length === 1}
          // TODO: should this be replaced with a standalone "learningpath" type?
          // article={article}
          // TODO: Should this be enabled?
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
