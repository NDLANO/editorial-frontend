/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Fragment, useState, ReactNode } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';

import { injectT, tType } from '@ndla/i18n';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import Accordion, { AccordionWrapper, AccordionBar, AccordionPanel } from '@ndla/accordion';
import { formClasses, FormikAbortButton, FormikAlertModalWrapper } from '../../FormikForm';
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
} from '../../../modules/audio/audioApiInterfaces';
import { Author, Copyright, License } from '../../../interfaces';

const podcastRules = {
  // TODO Oppdater denne
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
  coverPhotoAltText: {
    requred: true,
  },
  manuscript: {
    // TODO funker ikke?
    requred: true,
  },
  introduction: {
    requred: true,
  },
  imageFile: {
    requred: true,
  },
  coverPhotoId: {
    requred: true,
  },
};

interface PodcastFormikType {
  // TODO de typene som skal inn i formet. brukes i getInitialValues
  id?: string;
  revision?: number;
  language?: string;
  supportedLanguages?: any; // TODO FIX
  title?: string;
  audioFile: any; // TODO FIX
  filepath: '';
  //  copyright?: Copyright;
  tags?: string[];
  origin?: string;
  creators?: Author[];
  processors?: Author[];
  rightsholders?: Author[];
  license?: string;
  audioType?: 'podcast';
  header?: string;
  introduction?: string;
  coverPhotoId?: string;
  coverPhotoAltText?: string;
  manuscript?: string;
}

export const getInitialValues = (audio: PodcastPropType = {}): PodcastFormikType => {
  /// TODODODODOD DO THIS SE OM det skal være et nivå inn på podcast eller ikke, imageform som inspo
  return {
    id: audio?.id || '', // TODO remove ||
    revision: audio?.revision || 0, // TODO remove ||
    language: audio?.language || '', // TODO remove ||
    supportedLanguages: audio.supportedLanguages || [],
    title: audio.title || '',
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
    coverPhotoId: audio.podcastMeta?.coverPhotoId,
    coverPhotoAltText: audio.podcastMeta?.coverPhotoAltText,
    manuscript: audio.podcastMeta?.manuscript,
  };
};

interface PodcastPropType {
  id?: string;
  revision?: number;
  title?: string;
  language?: string;
  supportedLanguages?: string[];
  audioFile?: {
    //TODO flate ut som imageForm?
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
  | 'coverPhotoAltText'
  | 'coverPhotoId'
  | 'creators'
  | 'header'
  | 'imageFile'
  | 'introduction'
  | 'license'
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
  // TODO se over ???
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
  formikProps?: FormikProps<PodcastPropType>; // TODO hva skal være i <>
  licenses: License[];
  onUpdate?: (audioMetadata: NewPodcastMeta, audio: string | Blob) => void; // TODO ikke optional
}

const PodcastForm: FC<Props & tType> = ({ t, audio, inModal, licenses, formikProps }) => {
  const [savedToServer, setSavedToServer] = useState(false);

  const handleSubmit = async (
    values: PodcastFormikType,
    actions: FormikHelpers<PodcastFormikType>,
  ) => {
    const license = licenses.find(license => license.license === values.license);

    if (
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
      values.coverPhotoAltText === undefined
    ) {
      actions.setSubmitting(false);
      setSavedToServer(false);
      return;
    }

    actions.setSubmitting(true);
    const podcastMetaData: NewPodcastMetaInformation = {
      // TODO denne eller NewPodcastMeta
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
        coverPhotoId: values.coverPhotoId,
        coverPhotoAltText: values.coverPhotoAltText,
        manuscript: values.manuscript,
      },
    };

    // await onUpdate(podcastMetaData, values.audioFile);, se på den som blir sendt inn til AudioForm
    setSavedToServer(true);

    // actions.setSubmitting(false);
    // setSavedToServer(false);
  };

  const initialValues = getInitialValues(audio);
  // const { values, setFieldValue, isSubmitting } = formikProps;

  const panels: {
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
      title: 'Podcast informasjon',
      errorFields: ['header', 'introduction', 'coverPhotoId', 'coverPhotoAltText', 'manuscript'],
      component: (
        <PodcastMetaData
          header="test"
          introduction=""
          coverPhotoId=""
          coverPhotoAltText=""
          manuscript=""
        />
      ),
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
      onSubmit={() => {}}
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
              type="image"
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
                          ariaLabel={'TODO'}
                          onClick={() => handleItemClick(panel.id)}
                          title={panel.title} // TODO ADD t
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
              <FormikAbortButton outline disabled={isSubmitting}>
                {t('form.abort')}
              </FormikAbortButton>
              <SaveButton
                {...formClasses}
                isSaving={isSubmitting}
                showSaved={!formIsDirty && false}
                formIsDirty={formIsDirty}
                onClick={evt => {
                  evt.preventDefault();
                  submitForm();
                }}
              />
            </Field>
            <FormikAlertModalWrapper
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
