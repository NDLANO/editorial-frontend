/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState, useRef } from 'react';
import { Formik, FormikProps, FormikHelpers, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Descendant } from 'slate';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { IAudioMetaInformation, INewSeries, ISeries } from '@ndla/types-backend/audio-api';
import { AlertModalWrapper } from '../../FormikForm';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { isFormikFormDirty } from '../../../util/formHelper';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import PodcastSeriesMetaData from './PodcastSeriesMetaData';
import PodcastEpisodes from './PodcastEpisodes';
import {
  AUDIO_ADMIN_SCOPE,
  ITUNES_STANDARD_MAXIMUM_WIDTH,
  ITUNES_STANDARD_MINIMUM_WIDTH,
} from '../../../constants';
import { podcastSeriesTypeToFormType } from '../../../util/audioHelpers';
import FormWrapper from '../../../components/FormWrapper';
import { useSession } from '../../Session/SessionProvider';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../components/Accordion/FormAccordion';

const podcastRules: RulesType<PodcastSeriesFormikType, ISeries> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  description: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  coverPhotoId: {
    required: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values: PodcastSeriesFormikType) => !!values.coverPhotoId,
  },
};

const AdminWarningTextWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  p {
    color: ${colors.support.red};
  }
`;

export interface PodcastSeriesFormikType {
  id?: number;
  revision?: number;
  title: Descendant[];
  description: Descendant[];
  language: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  episodes: IAudioMetaInformation[];
  supportedLanguages: string[];
  hasRSS?: boolean;
}

interface Props {
  podcastSeries?: ISeries;
  language: string;
  inModal?: boolean;
  isNewlyCreated: boolean;
  formikProps?: FormikProps<PodcastSeriesFormikType>;
  onUpdate: (newPodcastSeries: INewSeries) => void;
  revision?: number;
  isNewLanguage?: boolean;
  supportedLanguages: string[];
}

const PodcastSeriesForm = ({
  podcastSeries,
  inModal,
  isNewlyCreated,
  onUpdate,
  language,
  isNewLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const { userPermissions } = useSession();
  const navigate = useNavigate();
  const size = useRef<[number, number] | undefined>(undefined);

  const isAudioAdmin = !!userPermissions?.includes(AUDIO_ADMIN_SCOPE);

  const handleSubmit = async (
    values: PodcastSeriesFormikType,
    actions: FormikHelpers<PodcastSeriesFormikType>,
  ) => {
    if (
      values.title === undefined ||
      values.language === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined ||
      values.hasRSS === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const title: string = editorValueToPlainText(values.title);
    const description: string = editorValueToPlainText(values.description);
    const newPodcastSeries: INewSeries = {
      revision: values.revision,
      title,
      description,
      coverPhotoId: values.coverPhotoId,
      coverPhotoAltText: values.metaImageAlt,
      language: values.language,
      episodes: values.episodes.map((ep) => ep.id),
      hasRSS: values.hasRSS,
    };

    await onUpdate(newPodcastSeries);
    setSavedToServer(true);
  };

  const validateMetaImage = ([width, height]: [
    number,
    number,
  ]): FormikErrors<PodcastSeriesFormikType> => {
    if (width !== height) {
      return { coverPhotoId: t('validation.podcastImageShape') };
    } else if (width < ITUNES_STANDARD_MINIMUM_WIDTH || width > ITUNES_STANDARD_MAXIMUM_WIDTH) {
      return { coverPhotoId: t('validation.podcastImageSize') };
    }
    return {};
  };

  const initialValues = podcastSeriesTypeToFormType(podcastSeries, language);
  const initialWarnings = getWarnings(initialValues, podcastRules, t, podcastSeries);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={(values) => {
        const errors = validateFormik(values, podcastRules, t);
        const metaImageErrors = size.current ? validateMetaImage(size.current) : {};
        return { ...errors, ...metaImageErrors };
      }}
      initialStatus={{ warnings: initialWarnings }}
    >
      {(formikProps) => {
        const { values, dirty, isSubmitting, errors, submitForm, validateForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: isNewLanguage,
        });

        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              id={podcastSeries?.id}
              language={language}
              noStatus
              supportedLanguages={supportedLanguages}
              type="podcast-series"
              title={podcastSeries?.title.title}
              hasRSS={podcastSeries?.hasRSS}
            />
            <FormAccordions defaultOpen={['podcast-series-podcastmeta']}>
              <FormAccordion
                id="podcast-series-podcastmeta"
                title={t('form.podcastSeriesSection')}
                className="u-4/6@desktop u-push-1/6@desktop"
                hasError={['title', 'coverPhotoId', 'metaImageAlt'].some(
                  (field) => field in errors,
                )}
              >
                <PodcastSeriesMetaData
                  handleSubmit={() => handleSubmit(values, formikProps)}
                  language={language}
                  onImageLoad={(width, height) => {
                    size.current = [width, height];
                    validateForm();
                  }}
                />
              </FormAccordion>
              <FormAccordion
                id="podcast-series-podcastepisodes"
                title={t('form.podcastEpisodesSection')}
                className={'u-6/6'}
                hasError={['title', 'coverPhotoId', 'metaImageAlt'].some(
                  (field) => field in errors,
                )}
              >
                <PodcastEpisodes />
              </FormAccordion>
            </FormAccordions>
            <Field right>
              <ButtonV2 variant="outline" disabled={isSubmitting} onClick={() => navigate(-1)}>
                {t('form.abort')}
              </ButtonV2>
              <SaveButton
                disabled={!isAudioAdmin}
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
                type={!inModal ? 'submit' : 'button'}
                onClick={(evt) => {
                  evt.preventDefault();
                  submitForm();
                }}
              />
            </Field>
            {!isAudioAdmin ? (
              <AdminWarningTextWrapper>
                <p>{t('podcastSeriesForm.adminError')}</p>
              </AdminWarningTextWrapper>
            ) : null}
            <AlertModalWrapper
              {...formikProps}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default PodcastSeriesForm;
