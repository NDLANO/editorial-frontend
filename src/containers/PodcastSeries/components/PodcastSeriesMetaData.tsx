/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { CheckboxItem } from '@ndla/forms';
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';
import { MetaImageSearch, TitleField } from '../../FormikForm';

interface Props {
  language?: string;
  onImageLoad?: (width: number, height: number) => void;
  hasRSS?: boolean;
}

const PodcastSeriesMetaData = ({ language, onImageLoad }: Props) => {
  const { t } = useTranslation();
  const plugins = [textTransformPlugin];
  return (
    <>
      <TitleField />

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
            language={language}
            podcastFriendly={true}
            {...field}
          />
        )}
      </FormikField>

      <FormikField name="hasRSS">
        {({ field }) => (
          <CheckboxItem
            label={t('podcastSeriesForm.hasRSS')}
            checked={field.value}
            onChange={() =>
              field.onChange({
                target: {
                  name: field.name,
                  value: !field.value,
                },
              })
            }
          />
        )}
      </FormikField>
    </>
  );
};

export default PodcastSeriesMetaData;
