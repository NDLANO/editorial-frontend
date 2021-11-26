/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';
import { MetaImageSearch } from '../../FormikForm';

interface Props {
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const plugins = [textTransformPlugin];

const PodcastMetaData = ({ onImageLoad }: Props) => {
  const { t } = useTranslation();

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
            plugins={plugins}
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

export default PodcastMetaData;
