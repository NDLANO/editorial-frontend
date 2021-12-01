/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { connect } from 'formik';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';
import { AudioFormikType } from './AudioForm';

const plugins = [textTransformPlugin];

const AudioManuscript = () => {
  const { t } = useTranslation();

  return (
    <FormikField label={t('podcastForm.fields.manuscript')} name="manuscript">
      {({ field }) => (
        <PlainTextEditor
          id={field.name}
          {...field}
          className={'manuscript'}
          placeholder={t('podcastForm.fields.manuscript')}
          plugins={plugins}
        />
      )}
    </FormikField>
  );
};

export default connect<{}, AudioFormikType>(AudioManuscript);
