/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import { MetaImageSearch, TitleField } from '../../FormikForm';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';

interface Props {
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const PodcastSeriesMetadata = ({ onImageLoad }: Props) => {
  const { t } = useTranslation();
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
