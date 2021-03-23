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
import FormikField from '../../../components/FormikField';
import { FormikMetaImageSearch } from '../../FormikForm';
import { NewPodcastMeta } from '../../../modules/audio/audioApiInterfaces';

interface Props {}

const PodcastMetaData: FC<Props & tType> = ({ t }) => {
  return (
    <>
      <FormikField label={t('podcastForm.fields.header')} name="header" />
      <FormikField label={t('podcastForm.fields.introduction')} name="introduction" />
      <FormikField label='bildekomponent' name="image" />
      <FormikField label={t('podcastForm.fields.manuscript')} name="manuscript" />

      {/* Q: kan jeg gjenbruke metabilde under her?
      <FormikField name="metaImageId">
          {({ field, form }) => (
          <FormikMetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton
            {...field}
          />
        )}
      </FormikField> */} // TODO re-introduce
    </>
  );
};

export default injectT(PodcastMetaData);
