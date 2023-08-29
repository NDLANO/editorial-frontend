/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from 'react';
import { useFormikContext } from 'formik';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Eye } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { IconButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';

import { IngressField, TitleField } from '../../FormikForm';
import HowToHelper from '../../../components/HowTo/HowToHelper';
import VisualElementField from '../../FormikForm/components/VisualElementField';

import { ConceptFormValues } from '../conceptInterfaces';
import LastUpdatedLine from '../../../components/LastUpdatedLine/LastUpdatedLine';
import { HandleSubmitFunc } from '../../FormikForm/articleFormHooks';

const ByLine = styled.div`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 64px;
`;

const PreviewButton = styled(IconButtonV2)<{ active: boolean }>`
  color: ${(p) => (p.active ? colors.brand.primary : colors.brand.light)};
`;

interface Props {
  handleSubmit: HandleSubmitFunc<ConceptFormValues>;
}

const ConceptContent = ({ handleSubmit: _handleSubmit }: Props) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const formikContext = useFormikContext<ConceptFormValues>();
  const {
    values: { creators, updated },
  } = formikContext;

  const handleSubmit = useCallback(() => {
    _handleSubmit(formikContext.values, formikContext);
  }, [_handleSubmit, formikContext]);

  return (
    <>
      <TitleField handleSubmit={handleSubmit} />
      <ByLine>
        <LastUpdatedLine onChange={() => {}} creators={creators} published={updated} />
        <IconContainer>
          <Tooltip tooltip={t('form.markdown.button')}>
            <PreviewButton
              aria-label={t('form.markdown.button')}
              variant="stripped"
              colorTheme="light"
              active={preview}
              onClick={() => setPreview(!preview)}
            >
              <Eye />
            </PreviewButton>
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
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default ConceptContent;
