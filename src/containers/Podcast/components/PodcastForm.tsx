/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
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
import { isFormikFormDirty } from '../../../util/formHelper';
import { toCreatePodcastFile, toEditPodcast } from '../../../util/routeHelpers';
import {
  PodcastMetaInformationPost,
  PodcastFormValues,
  PodcastMetaInformationPut,
  AudioApiType,
} from '../../../modules/audio/audioApiInterfaces';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import PodcastSeriesInformation from './PodcastSeriesInformation';
import handleError from '../../../util/handleError';
import { audioApiTypeToPodcastFormType } from '../../../util/audioHelpers';
import { useLicenses } from '../../../modules/draft/draftQueries';

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
    test: values => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
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

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

type OnCreateFunc = (newPodcast: PodcastMetaInformationPost, file?: string | Blob) => void;
type OnUpdateFunc = (newPodcast: PodcastMetaInformationPut, file?: string | Blob) => void;

interface Props {
  audio?: AudioApiType;
  podcastChanged?: boolean;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  language: string;
  onUpdate: OnCreateFunc | OnUpdateFunc;
  revision?: number;
  translating?: boolean;
  translateToNN?: () => void;
}

const PodcastForm = ({
  audio,
  podcastChanged,
  inModal,
  isNewlyCreated,
  language,
  onUpdate,
  translating,
  translateToNN,
}: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const size = useRef<[number, number] | undefined>(undefined);

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    const license = licenses!.find(license => license.license === values.license);

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
      title: values.title ? editorValueToPlainText(values.title) : '',
      manuscript: values.manuscript ? editorValueToPlainText(values.manuscript) : '',
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
        introduction: values.introduction ? editorValueToPlainText(values.introduction) : '',
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

  const initialValues = audioApiTypeToPodcastFormType(audio, language);
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
        const content = { ...audio, title: audio?.title.title ?? '', language };
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              noStatus
              values={values}
              type="podcast"
              content={content}
              editUrl={(lang: string) => {
                return values.id ? toEditPodcast(values.id, lang) : toCreatePodcastFile();
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
                  <AudioManuscript />
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
                  <AudioMetaData classes={formClasses} />
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
                onClick={evt => {
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

export default PodcastForm;
