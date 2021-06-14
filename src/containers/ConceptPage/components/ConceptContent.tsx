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

<<<<<<< HEAD
import { ReactEditor } from 'slate-react';
=======
>>>>>>> b39a5d6729af321b677690f3840ba033276775a2
import { Editor } from 'slate';
import { IngressField, TitleField } from '../../FormikForm';
import LastUpdatedLineConcept from '../../../components/LastUpdatedLineConcept';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { StyledHelpMessage } from '../../../components/FormikField/FormikFieldHelp';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import { submitFormWithMessage } from '../conceptUtil';

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

const ConceptContent = ({ t }: tType) => {
  const [preview, setPreview] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const formikContext = useFormikContext<ConceptFormValues>();
  const {
    values: { creators, created },
    handleBlur,
    submitForm,
    isValid,
  } = formikContext;

  return (
    <>
      <TitleField
        handleSubmit={submitForm}
<<<<<<< HEAD
        onBlur={(event: Event, editor: Editor) => {
          // Forcing slate field to be deselected before selecting new field.
          // Fixes a problem where slate field is not properly focused on click.
          ReactEditor.deselect(editor);

          // TODO: Can possibly be removed
=======
        onBlur={(event: Event, editor: Editor, next: Function) => {
          next();
>>>>>>> b39a5d6729af321b677690f3840ba033276775a2
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
        handleSubmit={() => submitFormWithMessage(formikContext, () => setShowWarning(true))}
        onBlur={(event: Event, editor: Editor) => {
          // Forcing slate field to be deselected before selecting new field.
          // Fixes a problem where slate field is not properly focused on click.
          ReactEditor.deselect(editor);

          // TODO: Can possibly be removed
          // this is a hack since formik onBlur-handler interferes with slates
          // related to: https://github.com/ianstormtaylor/slate/issues/2434
          // formik handleBlur needs to be called for validation to work (and touched to be set)
          setTimeout(
            () =>
              handleBlur({
                target: { name: 'conceptContent' },
              }),
            0,
          );
        }}
      />
      {!isValid && showWarning && <StyledHelpMessage error>{t('form.feil')}</StyledHelpMessage>}
    </>
  );
};

export default injectT(ConceptContent);
