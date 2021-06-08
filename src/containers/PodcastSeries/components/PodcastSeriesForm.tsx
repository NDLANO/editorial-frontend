/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, ReactNode } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Value } from 'slate';
import { formClasses, AbortButton, AlertModalWrapper } from '../../FormikForm';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toCreatePodcastSeries, toEditPodcastSeries } from '../../../util/routeHelpers';
import {
  PodcastFormValues,
  NewPodcastSeries,
  FlattenedPodcastSeries,
  AudioApiType,
} from '../../../modules/audio/audioApiInterfaces';
import {
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import PodcastSeriesMetaData from './PodcastSeriesMetaData';
import PodcastEpisodes from './PodcastEpisodes';

const podcastRules = {
  title: {
    required: true,
  },
  coverPhotoId: {
    required: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
  },
};

type PodcastSeriesPropType = Partial<FlattenedPodcastSeries> & { language: string };

export interface PodcastSeriesFormikType {
  id?: number;
  revision?: number;
  title: Value;
  language: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  episodes: AudioApiType[];
  supportedLanguages: string[];
}

const getInitialValues = (podcastSeries: PodcastSeriesPropType): PodcastSeriesFormikType => {
  const title: Value = plainTextToEditorValue(podcastSeries.title || '', true);
  return {
    id: podcastSeries.id,
    revision: podcastSeries.revision,
    language: podcastSeries.language,
    title,
    coverPhotoId: podcastSeries.coverPhoto?.id,
    metaImageAlt: podcastSeries.coverPhoto?.altText,
    episodes: podcastSeries.episodes ?? [],
    supportedLanguages: podcastSeries.supportedLanguages ?? [],
  };
};

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

interface Props {
  podcastSeries: PodcastSeriesPropType;
  inModal?: boolean;
  isNewlyCreated: boolean;
  formikProps?: FormikProps<PodcastSeriesFormikType>;
  onUpdate: (newPodcastSeries: NewPodcastSeries) => void;
  revision?: number;
}

const PodcastSeriesForm = ({
  t,
  podcastSeries,
  inModal,
  isNewlyCreated,
  onUpdate,
}: Props & tType) => {
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (
    values: PodcastSeriesFormikType,
    actions: FormikHelpers<PodcastSeriesFormikType>,
  ) => {
    if (
      values.title === undefined ||
      values.language === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const title: string = editorValueToPlainText(values.title);
    const newPodcastSeries: NewPodcastSeries = {
      id: values.id,
      revision: values.revision,
      title,
      coverPhotoId: values.coverPhotoId,
      coverPhotoAltText: values.metaImageAlt,
      language: values.language,
      episodes: values.episodes.map(ep => ep.id),
    };

    await onUpdate(newPodcastSeries);
    setSavedToServer(true);
  };

  const initialValues = getInitialValues(podcastSeries);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      enableReinitialize
      validate={values => validateFormik(values, podcastRules, t)}>
      {formikProps => {
        const { values, dirty, isSubmitting, errors, submitForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="podcast-series"
              content={podcastSeries}
              editUrl={(lang: string) => {
                if (values.id) return toEditPodcastSeries(values.id, lang);
                else toCreatePodcastSeries();
              }}
            />
            <Accordions>
              <AccordionSection
                startOpen
                id="podcast-series-podcastmeta"
                title={t('form.podcastSeriesSection')}
                className="u-4/6@desktop u-push-1/6@desktop"
                hasError={['title', 'coverPhotoId', 'metaImageAlt'].some(field => field in errors)}>
                <PodcastSeriesMetaData />
              </AccordionSection>
              <AccordionSection
                id="podcast-series-podcastepisodes"
                title={t('form.podcastEpisodesSection')}
                className="u-4/6@desktop u-push-1/6@desktop"
                hasError={['title', 'coverPhotoId', 'metaImageAlt'].some(field => field in errors)}>
                <PodcastEpisodes />
              </AccordionSection>
            </Accordions>
            <Field right>
              <AbortButton outline disabled={isSubmitting}>
                {t('form.abort')}
              </AbortButton>
              <SaveButton
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
                submit={!inModal}
                onClick={(evt: Event) => {
                  evt.preventDefault();
                  submitForm();
                }}
              />
            </Field>
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

export default injectT(PodcastSeriesForm);
