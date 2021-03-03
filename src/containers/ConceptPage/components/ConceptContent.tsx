/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import { Eye } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import FormikField from '../../../components/FormikField';
import { FormikIngress } from '../../FormikForm';
import LastUpdatedLineConcept from '../../../components/LastUpdatedLineConcept';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import FormikVisualElement from '../../FormikForm/components/FormikVisualElement';
import { Author } from '../../../interfaces';

const ByLine = styled.div`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 64px;
`;

interface ContentValues {
  creators: Author[];
  created: string;
  title: string;
  conceptContent: string;
}

const ConceptContent = ({ t }: tType) => {
  const [preview, setPreview] = useState(false);
  const {
    values: { creators, created },
    handleBlur,
    submitForm,
  } = useFormikContext<ContentValues>();

  return (
    <>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <ByLine>
        <LastUpdatedLineConcept creators={creators} published={created} />
        <IconContainer>
          <Tooltip tooltip={t('form.markdown.button')}>
            <ToggleButton active={preview} onClick={() => setPreview(!preview)}>
              <Eye />
            </ToggleButton>
          </Tooltip>
          <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
        </IconContainer>
      </ByLine>
      <FormikVisualElement />

      <FormikIngress
        name="conceptContent"
        maxLength={800}
        placeholder={t('form.name.conceptContent')}
        preview={preview}
        concept
        handleSubmit={submitForm}
        onBlur={(event: Event, editor: unknown, next: () => void) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'content' } }), 0);
        }}
      />
    </>
  );
};

export default injectT(ConceptContent);
