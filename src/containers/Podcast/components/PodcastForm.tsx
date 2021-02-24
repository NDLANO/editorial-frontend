/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Component, ReactNode } from 'react';
import { connect, FieldProps, Formik, Form, FormikProps, FormikContextType } from 'formik';

import { injectT, tType } from '@ndla/i18n';
import AudioMetaData from '../AudioUploader/components/AudioMetaData';
import AudioContent from '../AudioUploader/components/AudioContent';
import { formClasses } from '../../FormikForm';
import PodcastMetaData from './PodcastMetaData';
import { NewPodcastMetaInformation } from '../../../modules/audio/audioApiInterfaces';
import { Copyright } from '../../../interfaces';

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
};

interface PodcastFormikType {
  // TODO de typene som skal inn i formet. brukes i getInitialValues
  id?: string;
  title?: string;
  lanugage?: string;
  copyright?: Copyright;
  tags?: string[];
  audioType?: 'podcast';
  header?: string;
  introduction?: string;
  coverPhotoId?: string;
  coverPhotoAltText?: string;
  manuscript?: string;
}

export const getInitialValues = (audio: NewPodcastMetaInformation = {}): ImageFormikType => {
  /// TODODODODOD DO THIS SE OM det skal være et nivå inn på podcast eller ikke, imageform som inspo
  return {
    id: audio.id,
    title: audio.title,
    lanugage: audio.,
    copyright: audio.,
    tags: audio.,
    audioType: 'podcast',
    podcastMeta: {
      header: audio.,
      introduction: audio.,
      coverPhotoId: audio.,
      coverPhotoAltText: audio.,
      manuscript: audio.,
    }
  };
};

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
  formik: FormikContextType<any>; //TODO any?
}

const PodcastForm: FC<Props & tType> = ({ t, formik }) => {
  const handleSubmit = () => {};
  // const { values, errors, setFieldValue } = formik;

  const panels: {
    id: string;
    title: string;
    hasError: ErrorFields[];
    component: ReactNode;
  }[] = [
    // {
    //   id: 'podcast-upload-content',
    //   title: t('form.contentSection'),
    //   hasError: ['title', 'audioFile'],
    //   component: (
    //     <AudioContent classes={formClasses} setFieldValue={setFieldValue} values={values} />
    //   ),
    // },
    {
      id: 'podcast-upload-podcastmeta-metadataSection',
      title: 'Podcast informasjon',
      hasError: [],
      component: (
        <PodcastMetaData
          header=""
          introduction=""
          coverPhotoId=""
          coverPhotoAltText=""
          manuscript=""
        />
      ),
    },
    // {
    //   id: 'podcast-upload-metadataSection',
    //   title: t('form.metadataSection'),
    //   hasError: ['tags', 'creators', 'rightsholders', 'processors', 'license'].some(
    //     field => !!errors[field],
    //   ),
    //   component: (
    //     <AudioMetaData
    //       classes={formClasses}
    //       licenses={licenses}
    //       audioLanguage={audio.language}
    //       audioTags={audio.tags}
    //     />
    //   ),
    // },
  ];

  return (
    <Formik initialValues={() => {}} onSubmit={() => {}} validate={() => {}}>
      tt
    </Formik>
  );
};

export default injectT(PodcastForm);
