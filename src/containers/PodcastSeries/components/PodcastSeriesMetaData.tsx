/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import { MetaImageSearch, TitleField } from '../../FormikForm';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';

const PodcastSeriesMetadata = ({ t }: tType) => {
  const formikContext = useFormikContext<PodcastSeriesFormikType>();
  const { submitForm } = formikContext;
  const plugins = [textTransformPlugin];
  return (
    <>
      <TitleField handleSubmit={submitForm} />

      <FormikField name="description" label={t('podcastSeriesForm.description')}>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t('podcastSeriesForm.description')}
            {...field}
            plugins={plugins}
          />
        )}
      </FormikField>

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

export default injectT(PodcastSeriesMetadata);
