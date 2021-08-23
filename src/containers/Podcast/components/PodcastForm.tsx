/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Formik, Form, FormikProps, FormikHelpers, FormikErrors } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import { Accordions, AccordionSection } from '@ndla/accordion';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import AudioManuscript from '../../AudioUploader/components/AudioManuscript';
import { formClasses, AbortButton, AlertModalWrapper } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import Spinner from '../../../components/Spinner';
import {
  isFormikFormDirty,
  parseCopyrightContributors,
  DEFAULT_LICENSE,
} from '../../../util/formHelper';
import { toCreatePodcastFile, toEditPodcast } from '../../../util/routeHelpers';
import {
  NewPodcastMetaInformation,
  PodcastFormValues,
  UpdatedPodcastMetaInformation,
  FlattenedAudioApiType,
} from '../../../modules/audio/audioApiInterfaces';
import {
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import { License } from '../../../interfaces';
import PodcastSeriesInformation from './PodcastSeriesInformation';
import handleError from '../../../util/handleError';

const podcastRules: RulesType<PodcastFormValues> = {
  title: {
    required: true,
  },
  manuscript: {
    required: false,
  },
  audioFile: {
    required: true,
  },
  introduction: {
    required: true,
    maxLength: 1000,
  },
  coverPhotoId: {
    required: true,
  },
  metaImageAlt: {
    // coverPhotoAltText
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
  },
  tags: {
    minItems: 3,
  },
  license: {
    required: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
};

type PodcastPropType = Partial<FlattenedAudioApiType> & { language: string };

export const getInitialValues = (audio: PodcastPropType): PodcastFormValues => ({
  id: audio.id,
  revision: audio.revision,
  language: audio.language,
  supportedLanguages: audio.supportedLanguages || [],
  title: plainTextToEditorValue(audio.title || '', true),
  manuscript: plainTextToEditorValue(audio.manuscript || '', true),
  audioFile: audio.audioFile ? { storedFile: audio.audioFile } : {},
  filepath: '',
  tags: audio.tags || [],
  origin: audio?.copyright?.origin || '',
  creators: parseCopyrightContributors(audio, 'creators'),
  processors: parseCopyrightContributors(audio, 'processors'),
  rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
  license: audio?.copyright?.license?.license || DEFAULT_LICENSE.license,
  audioType: 'podcast',
  introduction: plainTextToEditorValue(audio.podcastMeta?.introduction, true),
  coverPhotoId: audio.podcastMeta?.coverPhoto.id,
  metaImageAlt: audio.podcastMeta?.coverPhoto.altText, // coverPhotoAltText
  series: audio.series ?? null,
  seriesId: audio.series?.id,
});

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

type OnCreateFunc = (newPodcast: NewPodcastMetaInformation, file?: string | Blob) => void;
type OnUpdateFunc = (newPodcast: UpdatedPodcastMetaInformation, file?: string | Blob) => void;

interface Props {
  audio: PodcastPropType;
  podcastChanged?: boolean;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  formikProps?: FormikProps<PodcastPropType>;
  licenses: License[];
  onUpdate: OnCreateFunc | OnUpdateFunc;
  revision?: number;
  translating?: boolean;
  translateToNN?: () => void;
}

const PodcastForm = ({
  t,
  audio,
  podcastChanged,
  inModal,
  isNewlyCreated,
  licenses,
  onUpdate,
  translating,
  translateToNN,
}: Props & tType) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const size = useRef<[number, number] | undefined>(undefined);

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    const license = licenses.find(license => license.license === values.license);

    if (
      license === undefined ||
      values.title === undefined ||
      values.manuscript === undefined ||
      values.language === undefined ||
      values.tags === undefined ||
      values.origin === undefined ||
      values.creators === undefined ||
      values.processors === undefined ||
      values.rightsholders === undefined ||
      values.introduction === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData = {
      id: values.id,
      revision: values.revision,
      title: editorValueToPlainText(values.title),
      manuscript: editorValueToPlainText(values.manuscript),
      tags: values.tags,
      audioType: 'podcast',
      language: values.language,
      copyright: {
        license,
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
      podcastMeta: {
        introduction: editorValueToPlainText(values.introduction),
        coverPhotoId: values.coverPhotoId,
        coverPhotoAltText: values.metaImageAlt,
      },
      seriesId: values.series?.id,
    };
    try {
      await onUpdate(podcastMetaData, values.audioFile.newFile?.file);
    } catch (e) {
      handleError(e);
    }
    setSavedToServer(true);
  };

  const validateMetaImage = useCallback(
    ([width, height]: [number, number]): FormikErrors<PodcastFormValues> => {
      if (width !== height) {
        return { coverPhotoId: t('validation.podcastImageShape') };
      } else if (width < 1400 || width > 3000) {
        return { coverPhotoId: t('validation.podcastImageSize') };
      }
      return {};
    },
    [t],
  );

  const validateFunction = useCallback(
    (values: PodcastFormValues): FormikErrors<PodcastFormValues> => {
      const errors = validateFormik(values, podcastRules, t);
      const metaImageErrors = size.current ? validateMetaImage(size.current) : {};
      const resp = { ...errors, ...metaImageErrors };
      return resp;
    },
    [t, validateMetaImage],
  );

  const initialValues = getInitialValues(audio);
  const initialErrors = useMemo(() => validateFunction(initialValues), [
    initialValues,
    validateFunction,
  ]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      initialErrors={initialErrors}
      enableReinitialize
      validate={validateFunction}>
      {formikProps => {
        const { values, dirty, isSubmitting, errors, submitForm, validateForm } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: podcastChanged,
        });
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="podcast"
              content={audio}
              editUrl={(lang: string) => {
                if (values.id) return toEditPodcast(values.id, lang);
                else toCreatePodcastFile();
              }}
              translateToNN={translateToNN}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <Accordions>
                <AccordionSection
                  id="podcast-upload-content"
                  title={t('form.contentSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['title', 'audioFile'].some(field => field in errors)}
                  startOpen>
                  <AudioContent classes={formClasses} />
                </AccordionSection>
                <AccordionSection
                  id="podcast-upload-podcastmanus"
                  title={t('podcastForm.fields.manuscript')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={[].some(field => field in errors)}>
                  <AudioManuscript classes={formClasses} />
                </AccordionSection>
                <AccordionSection
                  id="podcast-upload-podcastmeta"
                  title={t('form.podcastSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['introduction', 'coverPhotoId', 'metaImageAlt'].some(
                    field => field in errors,
                  )}>
                  <PodcastMetaData
                    onImageLoad={el => {
                      size.current = [
                        el.currentTarget.naturalWidth,
                        el.currentTarget.naturalHeight,
                      ];
                      validateForm();
                    }}
                    handleSubmit={submitForm}
                  />
                  <PodcastSeriesInformation />
                </AccordionSection>

                <AccordionSection
                  id="podcast-upload-metadata"
                  title={t('form.metadataSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
                    field => field in errors,
                  )}>
                  <AudioMetaData classes={formClasses} licenses={licenses} />
                </AccordionSection>
              </Accordions>
            )}

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

export default injectT(PodcastForm);
