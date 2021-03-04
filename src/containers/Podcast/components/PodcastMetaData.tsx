/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';

import { useFormikContext } from 'formik';

import FormikField from '../../../components/FormikField';
import { NewPodcastMeta } from '../../../modules/audio/audioApiInterfaces';

interface Props extends NewPodcastMeta {}

const PodcastMetaData: FC<Props & tType> = ({ t }) => {
  // const { values } = useFormikContext();

  return (
    <>
      <FieldHeader
        title={t('podcastForm.fields.header')}
      />
      <FormikField
        label={t('podcastForm.fields.header')}
        name="header"
        title
        noBorder
        placeholder="header"
      />
      <FieldHeader
        title={t('podcastForm.fields.introduction')}
      />
      <FormikField
        label={t('podcastForm.fields.introduction')} 
        name="introduction"
        noBorder
        placeholder="introduction"
      />
      <FieldHeader
        title={t('podcastForm.fields.coverPhoto')}
      /> {/* TODO bildeopplasting og alt-text */}
      <FormikField
        label={t('podcastForm.fields.coverPhoto')} 
        name="coverPhotoId"
        noBorder
        placeholder="coverPhotoId"
      />
      <FormikField
        label={t('podcastForm.fields.coverPhotoAltText')} 
        name="coverPhotoAltText"
        noBorder
        placeholder="coverPhotoAltText"
      />
      <FieldHeader
      title={t('podcastForm.fields.manuscript')}
      />
      <FormikField
        label={t('podcastForm.fields.manuscript')} 
        name="manuscript"
        noBorder
        placeholder="manuscript"
      />
    </>
  );
};

export default injectT(PodcastMetaData);
