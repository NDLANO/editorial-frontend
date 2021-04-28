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

import { Editor } from 'slate';
import { IngressField, TitleField } from '../../FormikForm';
import LastUpdatedLineConcept from '../../../components/LastUpdatedLineConcept';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import { submitFormWithMessage } from '../conceptUtil';

import { CreateMessageType } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

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

interface Props {
  createMessage: (o: CreateMessageType) => void;
}

const ConceptContent = ({ createMessage, t }: Props & tType) => {
  const [preview, setPreview] = useState(false);
  const formikContext = useFormikContext<ConceptFormValues>();
  const {
    values: { creators, created },
    handleBlur,
    submitForm,
  } = formikContext;

  return (
    <>
      <TitleField
        handleSubmit={submitForm}
        onBlur={(event: Event, editor: Editor, next: Function) => {
          next();
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(() => handleBlur({ target: { name: 'slatetitle' } }), 0);
        }}
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
      <VisualElementField />

      <IngressField
        name="conceptContent"
        maxLength={800}
        placeholder={t('form.name.conceptContent')}
        preview={preview}
        concept
        handleSubmit={() => submitFormWithMessage(formikContext, createMessage)}
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
