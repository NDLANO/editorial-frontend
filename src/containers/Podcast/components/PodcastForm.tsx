/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Fragment, useState, ReactNode } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import Accordion, { AccordionWrapper, AccordionBar, AccordionPanel } from '@ndla/accordion';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import { formClasses, AbortButton, AlertModalWrapper } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import SaveButton from '../../../components/SaveButton';
import Field from '../../../components/Field';
import { isFormikFormDirty, parseCopyrightContributors } from '../../../util/formHelper';
import { toEditPodcast } from '../../../util/routeHelpers';
import {
  NewPodcastMeta,
  NewPodcastMetaInformation,
  NewAudioMetaInformation,
  PodcastFormValues,
} from '../../../modules/audio/audioApiInterfaces';
import { Copyright, License } from '../../../interfaces';

const podcastRules = {
  title: {
    required: true,
  },
  tags: {
    minItems: 3,
  },
  creators: {
    minItems: 1,
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  audioFile: {
    required: true,
  },
  license: {
    required: true,
  },
  // coverPhotoAltText: {
  //   required: true,
  // },
  header: {
    required: true,
  },
  manuscript: {
    required: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values: PodcastFormValues) => !!values.coverPhotoId,
  },
  introduction: {
    required: true,
  },
  imageFile: {
    required: true,
  },
  coverPhotoId: {
    required: true,
  },
};

export const getInitialValues = (audio: PodcastPropType = {}): PodcastFormValues => {
  return {
    id: audio?.id || 0, // TODO remove ||
    revision: audio?.revision || 0, // TODO remove ||
    language: audio?.language || '', // TODO remove ||
    supportedLanguages: audio.supportedLanguages || [],
    title: audio.title,
    audioFile: audio.audioFile,
    filepath: '',
    tags: audio.tags || [],
    origin: audio?.copyright?.origin || '',
    creators: parseCopyrightContributors(audio, 'creators'),
    processors: parseCopyrightContributors(audio, 'processors'),
    rightsholders: parseCopyrightContributors(audio, 'rightsholders'),
    license: audio?.copyright?.license?.license,
    audioType: 'podcast',
    header: audio.podcastMeta?.header,
    introduction: audio.podcastMeta?.introduction,
    coverPhotoId: audio.podcastMeta?.coverPhoto?.id,
    metaImageAlt: audio.podcastMeta?.coverPhoto?.alt,
    metaImageUrl: audio.podcastMeta?.coverPhoto?.url,
    manuscript: audio.podcastMeta?.manuscript,
  };
};

interface PodcastPropType {
  id?: number;
  revision?: number;
  title?: string;
  language?: string;
  supportedLanguages?: string[];
  audioFile?: {
    url: string;
    mimeType: string;
    fileSize: number;
    language: string;
  };
  copyright?: Copyright;
  tags?: string[];
  audioType?: 'podcast';
  podcastMeta?: NewPodcastMeta;
}

type ErrorFields =
  | 'alttext'
  | 'audioFile'
  | 'caption'
  | 'creators'
  | 'coverPhotoId'
  | 'header'
  | 'imageFile'
  | 'introduction'
  | 'license'
  | 'metaImageAlt'
  | 'manuscript'
  | 'processors'
  | 'rightsholders'
  | 'tags'
  | 'title'
  | 'audioFile';

const FormWrapper = ({ inModal, children }: { inModal?: boolean; children: ReactNode }) => {
  if (inModal) {
    return <div {...formClasses()}>{children}</div>;
  }
  return <Form>{children}</Form>;
};

type openIndexesProps = number | string;

type AccordionChildrenProps = {
  // TODO reuse from ImageForm, move
  openIndexes: Array<openIndexesProps>;
  handleItemClick: (arg: openIndexesProps) => void;
  getBarProps: (
    arg: openIndexesProps,
  ) => {
    tiny?: boolean;
    onClick: () => void;
    isOpen: boolean;
    panelId: openIndexesProps;
  };
  getPanelProps: (
    arg: openIndexesProps,
  ) => {
    id: openIndexesProps;
    isOpen: boolean;
    tiny?: boolean;
  };
};

interface Props {
  audio: PodcastPropType;
  inModal?: boolean;
  isNewlyCreated?: boolean;
  formikProps?: FormikProps<PodcastPropType>; // TODO type in <?>
  licenses: License[];
  onUpdate: (audioMetadata: NewAudioMetaInformation, podcastFile: string | Blob) => void;
}

const PodcastForm: FC<Props & tType> = ({
  t,
  audio,
  inModal,
  isNewlyCreated,
  licenses,
  onUpdate,
}) => {
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (
    values: PodcastFormValues,
    actions: FormikHelpers<PodcastFormValues>,
  ) => {
    const license = licenses.find(license => license.license === values.license);

    if (
      // TODO, burde vel finnes en bedre måte å gjøre dette på
      license === undefined ||
      values.title === undefined ||
      values.language === undefined ||
      values.tags === undefined ||
      values.origin === undefined ||
      values.creators === undefined ||
      values.processors === undefined ||
      values.rightsholders === undefined ||
      values.header === undefined ||
      values.manuscript === undefined ||
      values.introduction === undefined ||
      values.coverPhotoId === undefined ||
      values.metaImageAlt === undefined ||
      values.metaImageUrl === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData: NewPodcastMetaInformation = {
      id: values.id, // Used only to check if image was newly created. This id is discarded by backend. TODO
      title: values.title,
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
        header: values.header,
        introduction: values.introduction,
        coverPhoto: {
          id: values.coverPhotoId,
          url: values.metaImageUrl,
          alt: values.metaImageAlt,
        },
        manuscript: values.manuscript,
        language: values.language, // TODO ??
      },
    };

    await onUpdate(podcastMetaData, values.audioFile);
    setSavedToServer(true);
  };

  const initialValues = getInitialValues(audio);

  const panels: {
    // TODO replace with aod AccordionSection
    id: string;
    title: string;
    errorFields: ErrorFields[];
    component: ReactNode;
  }[] = [
    {
      id: 'podcast-upload-content',
      title: t('form.contentSection'),
      errorFields: ['title', 'audioFile'],
      component: <AudioContent />,
    },
    {
      id: 'podcast-upload-podcastmeta-metadataSection',
      title: t('form.podcastSection'),
      errorFields: ['header', 'introduction', 'coverPhotoId', 'metaImageAlt', 'manuscript'],
      component: <PodcastMetaData />,
    },
    {
      id: 'podcast-upload-metadataSection',
      title: t('form.metadataSection'),
      errorFields: ['tags', 'creators', 'rightsholders', 'processors', 'license'],
      component: <AudioMetaData classes={formClasses} licenses={licenses} />,
    },
  ];

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
              type="audio"
              content={audio}
              editUrl={(lang: string) => toEditPodcast(values.id, lang)}
            />
            <Accordion openIndexes={['podcast-upload-content']}>
              {({ openIndexes, handleItemClick }: AccordionChildrenProps) => (
                <AccordionWrapper>
                  {panels.map(panel => {
                    const hasError = panel.errorFields.some(field => field in errors);
                    return (
                      <Fragment key={panel.id}>
                        <AccordionBar
                          panelId={panel.id}
                          ariaLabel={panel.title}
                          onClick={() => handleItemClick(panel.id)}
                          title={panel.title}
                          hasError={hasError}
                          isOpen={openIndexes.includes(panel.id)}
                        />
                        {openIndexes.includes(panel.id) && (
                          <AccordionPanel
                            id={panel.id}
                            hasError={hasError}
                            isOpen={openIndexes.includes(panel.id)}>
                            <div className="u-4/6@desktop u-push-1/6@desktop">
                              {panel.component}
                            </div>
                          </AccordionPanel>
                        )}
                      </Fragment>
                    );
                  })}
                </AccordionWrapper>
              )}
            </Accordion>
            <Field right>
              <AbortButton outline disabled={isSubmitting}>
                {t('form.abort')}
              </AbortButton>
              <SaveButton
                {...formClasses}
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                formIsDirty={formIsDirty}
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
