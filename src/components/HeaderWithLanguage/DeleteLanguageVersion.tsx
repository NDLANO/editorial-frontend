/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { deleteLanguageVersionConcept } from '../../modules/concept/conceptApi';
import { deleteLanguageVersionImage } from '../../modules/image/imageApi';
import {
  deleteLanguageVersionAudio,
  deleteLanguageVersionSeries,
} from '../../modules/audio/audioApi';
import { deleteLanguageVersion as deleteLanguageVersionDraft } from '../../modules/draft/draftApi';
import {
  toCreateAudioFile,
  toCreateConcept,
  toCreateImage,
  toCreatePodcastFile,
  toCreatePodcastSeries,
  toEditArticle,
  toEditAudio,
  toEditConcept,
  toEditImage,
  toEditPodcast,
  toEditPodcastSeries,
} from '../../util/routeHelpers';
import AlertModal from '../AlertModal';
import StyledFilledButton from '../StyledFilledButton';
import { formatErrorMessage } from '../../util/apiHelpers';
import { useMessages } from '../../containers/Messages/MessagesProvider';

const StyledWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
`;

const nonDeletableTypes = ['standard', 'topic-article', 'concept'];

interface Props {
  values: {
    id?: number;
    language: string;
    supportedLanguages: string[];
    articleType?: string;
  };
  disabled: boolean;
  type: string;
}

const DeleteLanguageVersion = ({ values, type, disabled }: Props) => {
  const { t } = useTranslation();
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();

  const toggleShowDeleteWarning = () => {
    setShowDeleteWarning(!showDeleteWarning);
  };

  const deleteLanguageVersion = async () => {
    const { id, supportedLanguages, language, articleType } = values;
    if (id && supportedLanguages.includes(language)) {
      toggleShowDeleteWarning();
      const otherSupportedLanguage = supportedLanguages.find(lang => lang !== language);

      const newAfterLanguageDeletion = supportedLanguages.length <= 1;

      try {
        switch (type) {
          case 'audio':
            await deleteLanguageVersionAudio(id, language);
            navigate(
              newAfterLanguageDeletion
                ? toCreateAudioFile()
                : toEditAudio(id, otherSupportedLanguage!),
            );
            break;
          case 'podcast':
            await deleteLanguageVersionAudio(id, language);
            navigate(
              newAfterLanguageDeletion
                ? toCreatePodcastFile()
                : toEditPodcast(id, otherSupportedLanguage!),
            );
            break;
          case 'podcast-series':
            await deleteLanguageVersionSeries(id, language);
            navigate(
              newAfterLanguageDeletion
                ? toCreatePodcastSeries()
                : toEditPodcastSeries(id, otherSupportedLanguage!),
            );
            break;
          case 'image':
            await deleteLanguageVersionImage(id, language);
            navigate(
              newAfterLanguageDeletion ? toCreateImage() : toEditImage(id, otherSupportedLanguage!),
            );
            break;
          case 'concept':
            await deleteLanguageVersionConcept(id, language);
            navigate(
              newAfterLanguageDeletion
                ? toCreateConcept()
                : toEditConcept(id, otherSupportedLanguage!),
            );
            break;
          default:
            await deleteLanguageVersionDraft(id, language);
            navigate(toEditArticle(id, articleType!, otherSupportedLanguage));
            break;
        }
      } catch (error) {
        createMessage(formatErrorMessage(error as any));
      }
    }
  };
  const { id, supportedLanguages, language } = values;

  if (
    !id ||
    !supportedLanguages.includes(language) ||
    (nonDeletableTypes.includes(type) && supportedLanguages.length < 2)
  ) {
    return null;
  }

  return (
    <StyledWrapper>
      <StyledFilledButton
        type="button"
        disabled={disabled}
        deletable
        onClick={toggleShowDeleteWarning}>
        <DeleteForever />
        {t('form.workflow.deleteLanguageVersion.button', {
          languageVersion: t(`language.${language}`).toLowerCase(),
        })}
      </StyledFilledButton>
      <AlertModal
        show={showDeleteWarning}
        text={t('form.workflow.deleteLanguageVersion.modal')}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleShowDeleteWarning,
          },
          {
            text: t('form.workflow.deleteLanguageVersion.button', {
              languageVersion: t(`language.${language}`).toLowerCase(),
            }),
            onClick: deleteLanguageVersion,
          },
        ]}
        onCancel={toggleShowDeleteWarning}
      />
    </StyledWrapper>
  );
};

export default DeleteLanguageVersion;
