/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Editor } from 'slate';

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import { MetaImageSearch, TitleField } from '../../FormikForm';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';

interface Props {}

const PodcastSeriesMetadata = ({ t }: Props & tType) => {
  const formikContext = useFormikContext<PodcastSeriesFormikType>();
  const { handleBlur, submitForm } = formikContext;
  return (
    <>
      <TitleField
        name={'title'}
        handleSubmit={submitForm}
        onBlur={(event: Event, editor: Editor, next: Function) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'slatetitle' } }), 0);
        }}
      />

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
