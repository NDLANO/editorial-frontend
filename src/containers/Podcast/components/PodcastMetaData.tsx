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

interface Props extends NewPodcastMeta {}

const PodcastMetaData: FC<Props & tType> = ({ t }) => {
  return (
    <>
      <FieldHeader title={t('podcastForm.fields.header')} />
      <FormikField
        name="header"
        label={t('podcastForm.fields.header')}
        obligatory
        noBorder
        placeholder={t('podcastForm.fields.header')}
      />
      <FieldHeader title={t('podcastForm.fields.introduction')} />
      <FormikField
        name="introduction"
        label={t('podcastForm.fields.introduction')}
        noBorder
        obligatory
        placeholder={t('podcastForm.fields.introduction')}
      />

      {/* Q: kan jeg gjenbruke metabilde under her? */}
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <FormikMetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton
            {...field}
          />
        )}
      </FormikField>

      <FieldHeader title={t('podcastForm.fields.manuscript')} />
      <FormikField
        name="manuscript"
        label={t('podcastForm.fields.manuscript')}
        noBorder
        obligatory
        placeholder={t('podcastForm.fields.manuscript')}
      />
    </>
  );
};

export default injectT(PodcastMetaData);
