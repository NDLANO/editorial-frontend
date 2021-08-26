/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from 'slate';

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import { MetaImageSearch, TitleField } from '../../FormikForm';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import textTransformPlugin from '../../../components/SlateEditor/plugins/textTransform';

interface Props {
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const PodcastSeriesMetadata = ({ onImageLoad }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<PodcastSeriesFormikType>();
  const { handleBlur, submitForm } = formikContext;
  const plugins = [textTransformPlugin()];
  return (
    <>
      <TitleField
        name="title"
        handleSubmit={submitForm}
        onBlur={(event: Event, editor: Editor, next: Function) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'slatetitle' } }), 0);
        }}
      />

      <FormikField name="description" label={t('podcastSeriesForm.description')}>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t('podcastSeriesForm.description')}
            handleSubmit={() => {}}
            {...field}
            onBlur={(event: Event, editor: unknown, next: () => void) => {
              next();
              // this is a hack since formik onBlur-handler interferes with slates
              // related to: https://github.com/ianstormtaylor/slate/issues/2434
              // formik handleBlur needs to be called for validation to work (and touched to be set)
              setTimeout(() => handleBlur({ target: { name: 'description' } }), 0);
            }}
            plugins={plugins}
          />
        )}
      </FormikField>

      <FormikField name="coverPhotoId">
        {({ field, form }) => (
          <MetaImageSearch
            onImageLoad={onImageLoad}
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

export default PodcastSeriesMetadata;
