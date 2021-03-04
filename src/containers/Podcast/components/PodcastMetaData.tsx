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
import { FormikMetaImageSearch } from '../../FormikForm';

import { NewPodcastMeta } from '../../../modules/audio/audioApiInterfaces';

interface Props extends NewPodcastMeta {}

const PodcastMetaData: FC<Props & tType> = ({ t }) => {
  // const { values } = useFormikContext();

  return (
    <>
      <FieldHeader title={t('podcastForm.fields.header')} />
      <FormikField
        label={t('podcastForm.fields.header')}
        name="header"
        title
        noBorder
        placeholder="header"
      />
      <FieldHeader title={t('podcastForm.fields.introduction')} />
      <FormikField
        label={t('podcastForm.fields.introduction')}
        name="introduction"
        noBorder
        placeholder="introduction"
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
        label={t('podcastForm.fields.manuscript')}
        name="manuscript"
        noBorder
        placeholder="manuscript"
      />
    </>
  );
};

export default injectT(PodcastMetaData);
