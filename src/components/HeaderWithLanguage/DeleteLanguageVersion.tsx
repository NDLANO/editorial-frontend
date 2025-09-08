/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteBinLine } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { deleteLanguageVersionAudio, deleteLanguageVersionSeries } from "../../modules/audio/audioApi";
import { deleteLanguageVersionConcept } from "../../modules/concept/conceptApi";
import { deleteLanguageVersion as deleteLanguageVersionDraft } from "../../modules/draft/draftApi";
import { filmQueryKeys } from "../../modules/frontpage/filmQueryKeys";
import {
  deleteFilmFrontPageLanguageVersion,
  deleteSubectPageLanguageVersion,
} from "../../modules/frontpage/frontpageApi";
import { deleteLanguageVersionImage } from "../../modules/image/imageApi";
import { deleteLearningpathLanguage } from "../../modules/learningpath/learningpathApi";
import { learningpathQueryKeys } from "../../modules/learningpath/learningpathQueries";
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
  toEditSubjectpage,
  toCreateSubjectpage,
  toEditNdlaFilm,
  toStructure,
  toEditLearningpath,
} from "../../util/routeHelpers";
import { AlertDialog } from "../AlertDialog/AlertDialog";
import { FormActionsContainer } from "../FormikForm";

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
  const { elementId } = useParams<"elementId">();
  const queryClient = useQueryClient();

  const toggleShowDeleteWarning = useCallback(() => {
    setShowDeleteWarning((p) => !p);
  }, []);

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
          case "subjectpage":
            await deleteSubectPageLanguageVersion(id, language);
            if (!newAfterLanguageDeletion && elementId && otherSupportedLanguage) {
              navigate(toEditSubjectpage(elementId, otherSupportedLanguage, id));
            } else if (elementId) {
              navigate(toCreateSubjectpage(elementId, "nb"));
            } else {
              navigate(toStructure());
            }
            break;
          case "filmfrontpage":
            await deleteFilmFrontPageLanguageVersion(language);
            await queryClient.invalidateQueries({ queryKey: filmQueryKeys.filmFrontpage });
            navigate(toEditNdlaFilm(otherSupportedLanguage));
            break;
          case "learningpath":
            await deleteLearningpathLanguage(id, language);
            await queryClient.invalidateQueries({ queryKey: learningpathQueryKeys.learningpath({ id, language }) });
            navigate(toEditLearningpath(id, otherSupportedLanguage!));
            break;
          default:
            createMessage({ message: t("embed.unsupported", { type }) });
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
    <>
      <Button disabled={disabled} variant="danger" size="small" onClick={toggleShowDeleteWarning}>
        <DeleteBinLine />
        {t("form.workflow.deleteLanguageVersion.button", {
          languageVersion: t(`languages.${language}`).toLowerCase(),
        })}
      </Button>
      <AlertDialog
        title={t("form.workflow.deleteLanguageVersion.title")}
        label={t("form.workflow.deleteLanguageVersion.title")}
        show={showDeleteWarning}
        onCancel={toggleShowDeleteWarning}
        text={t("form.workflow.deleteLanguageVersion.dialog")}
      >
        <FormActionsContainer>
          <Button onClick={toggleShowDeleteWarning} variant="danger">
            {t("form.abort")}
          </Button>
          <Button onClick={deleteLanguageVersion}>
            {t("form.workflow.deleteLanguageVersion.button", {
              languageVersion: t(`languages.${language}`).toLowerCase(),
            })}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default DeleteLanguageVersion;
