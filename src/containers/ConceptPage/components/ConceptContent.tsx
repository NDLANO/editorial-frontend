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
import { useTranslation } from 'react-i18next';
import { Eye } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { IngressField, TitleField } from '../../FormikForm';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import { StyledHelpMessage } from '../../../components/FormikField/FormikFieldHelp';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import { submitFormWithMessage } from '../conceptUtil';

import { ConceptFormValues } from '../conceptInterfaces';
import LastUpdatedLine from '../../../components/LastUpdatedLine/LastUpdatedLine';

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

const ConceptContent = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const formikContext = useFormikContext<ConceptFormValues>();
  const {
    values: { creators, updated },
    submitForm,
    isValid,
  } = formikContext;

  return (
    <>
      <TitleField handleSubmit={submitForm} />
      <ByLine>
        <LastUpdatedLine
          name={'lastUpdated'}
          onChange={() => {}}
          creators={creators}
          published={updated}
        />
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
      />
      {!isValid && showWarning && <StyledHelpMessage error>{t('form.feil')}</StyledHelpMessage>}
    </>
  );
};

export default ConceptContent;
