/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { DeleteForever } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { deleteLanguageVersionAudio, deleteLanguageVersionSeries } from "../../modules/audio/audioApi";
import { deleteLanguageVersionConcept } from "../../modules/concept/conceptApi";
import { deleteLanguageVersion as deleteLanguageVersionDraft } from "../../modules/draft/draftApi";
import { deleteLanguageVersionImage } from "../../modules/image/imageApi";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import {
  toCreateAudioFile,
  toCreateConcept,
  toCreateGloss,
  toCreateImage,
  toCreatePodcastFile,
  toCreatePodcastSeries,
  toEditAudio,
  toEditConcept,
  toEditGloss,
  toEditFrontPageArticle,
  toEditImage,
  toEditLearningResource,
  toEditPodcast,
  toEditPodcastSeries,
  toEditTopicArticle,
} from "../../util/routeHelpers";
import { AlertDialog } from "../AlertDialog/AlertDialog";

const DeleteButton = styled(ButtonV2)`
  white-space: nowrap;
  span {
    color: ${colors.brand.primary};
  }
  &:hover,
  &:active,
  &:focus-within {
    span {
      color: currentColor;
    }
  }
`;

const StyledWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-self: flex-start;
`;

const nonDeletableTypes = ["standard", "topic-article", "concept"];

interface Props {
  language: string;
  supportedLanguages: string[];
  id: number;
  disabled: boolean;
  type: string;
}

const DeleteLanguageVersion = ({ id, language, supportedLanguages, type, disabled }: Props) => {
  const { t } = useTranslation();
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { createMessage, formatErrorMessage } = useMessages();
  const navigate = useNavigate();

  const toggleShowDeleteWarning = () => {
    setShowDeleteWarning(!showDeleteWarning);
  };

  const deleteLanguageVersion = async () => {
    if (supportedLanguages.includes(language)) {
      toggleShowDeleteWarning();
      const otherSupportedLanguage = supportedLanguages.find((lang) => lang !== language);

      const newAfterLanguageDeletion = supportedLanguages.length <= 1;

      try {
        switch (type) {
          case "audio":
            await deleteLanguageVersionAudio(id, language);
            navigate(newAfterLanguageDeletion ? toCreateAudioFile() : toEditAudio(id, otherSupportedLanguage!));
            break;
          case "podcast":
            await deleteLanguageVersionAudio(id, language);
            navigate(newAfterLanguageDeletion ? toCreatePodcastFile() : toEditPodcast(id, otherSupportedLanguage!));
            break;
          case "podcast-series":
            await deleteLanguageVersionSeries(id, language);
            navigate(
              newAfterLanguageDeletion ? toCreatePodcastSeries() : toEditPodcastSeries(id, otherSupportedLanguage!),
            );
            break;
          case "image":
            await deleteLanguageVersionImage(id, language);
            navigate(newAfterLanguageDeletion ? toCreateImage() : toEditImage(id, otherSupportedLanguage!));
            break;
          case "concept":
            await deleteLanguageVersionConcept(id, language);
            navigate(newAfterLanguageDeletion ? toCreateConcept() : toEditConcept(id, otherSupportedLanguage!));
            break;
          case "gloss":
            await deleteLanguageVersionConcept(id, language);
            navigate(newAfterLanguageDeletion ? toCreateGloss() : toEditGloss(id, otherSupportedLanguage!));
            break;
          case "standard":
            await deleteLanguageVersionDraft(id, language);
            navigate(toEditLearningResource(id, otherSupportedLanguage!));
            break;
          case "topic-article":
            await deleteLanguageVersionDraft(id, language);
            navigate(toEditTopicArticle(id, otherSupportedLanguage!));
            break;

          case "frontpage-article":
            await deleteLanguageVersionDraft(id, language);
            navigate(toEditFrontPageArticle(id, otherSupportedLanguage!));
            break;
        }
      } catch (error) {
        createMessage(formatErrorMessage(error as NdlaErrorPayload));
      }
    }
  };

  if (!supportedLanguages.includes(language) || (nonDeletableTypes.includes(type) && supportedLanguages.length < 2)) {
    return null;
  }

  return (
    <StyledWrapper>
      <DeleteButton disabled={disabled} variant="ghost" colorTheme="danger" onClick={toggleShowDeleteWarning}>
        <DeleteForever />
        <span>
          {t("form.workflow.deleteLanguageVersion.button", {
            languageVersion: t(`languages.${language}`).toLowerCase(),
          })}
        </span>
      </DeleteButton>
      <AlertDialog
        title={t("form.workflow.deleteLanguageVersion.title")}
        label={t("form.workflow.deleteLanguageVersion.title")}
        show={showDeleteWarning}
        onCancel={toggleShowDeleteWarning}
        text={t("form.workflow.deleteLanguageVersion.modal")}
      >
        <HStack justify="flex-end" gap="xsmall">
          <Button onClick={toggleShowDeleteWarning} variant="danger">
            {t("form.abort")}
          </Button>
          <Button onClick={deleteLanguageVersion}>{t("form.workflow.deleteLanguageVersion.button")}</Button>
        </HStack>
      </AlertDialog>
    </StyledWrapper>
  );
};

export default DeleteLanguageVersion;
