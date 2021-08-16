/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';

import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';

const plugins = [textTransformPlugin];

const AudioManuscript = ({ t }: tType) => {

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

export default injectT(AudioManuscript);
