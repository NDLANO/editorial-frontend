/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Fragment, Component, ReactNode } from 'react';
import { connect, FieldProps, Formik, Form, FormikProps, FormikContextType } from 'formik';

import { injectT, tType } from '@ndla/i18n';
import AudioContent from '../../AudioUploader/components/AudioContent';
import AudioMetaData from '../../AudioUploader/components/AudioMetaData';
import Accordion, { AccordionWrapper, AccordionBar, AccordionPanel } from '@ndla/accordion';
import { formClasses } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import { isFormikFormDirty, parseCopyrightContributors } from '../../../util/formHelper';
import { toEditPodcast } from '../../../util/routeHelpers';
import { NewPodcastMeta } from '../../../modules/audio/audioApiInterfaces';
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
  | 'caption'
  | 'creators'
  | 'imageFile'
  | 'license'
  | 'processors'
  | 'rightsholders'
  | 'tags'
  | 'title'
  | 'audioFile';

interface Props {
  // formik: FormikContextType<any>; //TODO any?
  audio: PodcastPropType;
  inModal?: boolean;
  formikProps?: FormikProps<PodcastPropType>; // TODO hva skal være i <>
  licenses: License[];
}

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

const PodcastForm: FC<Props & tType> = ({ t, audio, inModal, licenses, formikProps }) => {
  const handleSubmit = () => {};

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
      errorFields: [],
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
        const { values, dirty, errors } = formikProps;
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
            <Accordion
              openIndexes={[
                'podcast-upload-content',
                'podcast-upload-podcastmeta-metadataSection',
              ]}>
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
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default injectT(PodcastForm);
