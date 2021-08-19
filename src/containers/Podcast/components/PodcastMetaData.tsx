/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { SyntheticEvent } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { useFormikContext } from 'formik';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import textTransformPlugin from '../../../components/SlateEditor/plugins/textTransform';
import { MetaImageSearch } from '../../FormikForm';
import { PodcastFormValues } from '../../../modules/audio/audioApiInterfaces';

interface Props {
  handleSubmit: () => void;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const plugins = [textTransformPlugin()];

const PodcastMetaData = ({ handleSubmit, onImageLoad, t }: Props & tType) => {
  const formikContext = useFormikContext<PodcastFormValues>();
  const { handleBlur } = formikContext;

  return (
    <>
      <FormikField
        label={t('podcastForm.fields.introduction')}
        name="introduction"
        maxLength={1000}
        showMaxLength>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            className={'introduction'}
            placeholder={t('podcastForm.fields.introduction')}
            handleSubmit={handleSubmit}
            plugins={plugins}
            onBlur={(event: Event, editor: unknown, next: () => void) => {
              next();
              // this is a hack since formik onBlur-handler interferes with slates
              // related to: https://github.com/ianstormtaylor/slate/issues/2434
              // formik handleBlur needs to be called for validation to work (and touched to be set)
              setTimeout(() => handleBlur({ target: { name: 'introduction' } }), 0);
            }}
          />
        )}
      </FormikField>
      <FormikField name="coverPhotoId">
        {({ field, form }) => {
          return (
            <MetaImageSearch
              metaImageId={field.value}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton
              onImageLoad={onImageLoad}
              {...field}
            />
          );
        }}
      </FormikField>
    </>
  );
};

export default injectT(PodcastMetaData);
