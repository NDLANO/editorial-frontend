/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import FormikField from '../../../components/FormikField';
import { MetaImageSearch } from '../../FormikForm';

interface Props {}

const PodcastMetaData: FC<Props & tType> = ({ t }) => {
  return (
    <>
      <FormikField label={t('podcastForm.fields.header')} name="header" />
      <FormikField label={t('podcastForm.fields.introduction')} name="introduction" />
      <FormikField label={t('podcastForm.fields.manuscript')} name="manuscript" />
      <FormikField name="coverPhotoId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default injectT(PodcastMetaData);
