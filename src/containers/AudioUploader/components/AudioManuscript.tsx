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
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import textTransformPlugin from '../../../components/SlateEditor/plugins/textTransform';

interface Props {
  handleSubmit: () => void;
  onBlur: (event: Event, editor: Editor, next: () => void) => void;
}

const plugins = [textTransformPlugin()];

const AudioManuscript = ({ handleSubmit, onBlur, t }: Props & tType) => (
  <FormikField label={t('podcastForm.fields.manuscript')} name="manuscript">
    {({ field }) => (
      <PlainTextEditor
        id={field.name}
        {...field}
        className={'manuscript'}
        placeholder={t('podcastForm.fields.manuscript')}
        handleSubmit={handleSubmit}
        plugins={plugins}
        onBlur={onBlur}
      />
    )}
  </FormikField>
);

export default injectT(AudioManuscript);
