/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, useFormikContext } from 'formik';
import BEMHelper from 'react-bem-helper';
import { FieldHeader } from '@ndla/forms';
import VisualElement from '../../VisualElement/VisualElement';
import FormikField, { FormikFieldHelp } from '../../../components/FormikField';
import HowToHelper from '../../../components/HowTo/HowToHelper';

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

const extraErrorFields = ['visualElementCaption', 'visualElementAlt'];

interface VisualElementValues {
  language: string;
}
interface Props {
  types?: string[];
}
const VisualElementField = ({ types }: Props) => {
  const { t } = useTranslation();
  const formik = useFormikContext<VisualElementValues>();

  return (
    <>
      <FormikField name="visualElement">
        {({ field }) => (
          <div>
            <FieldHeader title={t('form.visualElement.title')}>
              <HowToHelper pageId="VisualElement" tooltip={t('form.visualElement.helpLabel')} />
            </FieldHeader>
            <>
              <VisualElement
                label={t('form.visualElement.label')}
                language={formik.values.language}
                types={types}
                {...field}
              />
            </>
          </div>
        )}
      </FormikField>
      {extraErrorFields.map(extraErrorField => (
        <ErrorMessage key={`topic_article_visualelement_${extraErrorField}`} name={extraErrorField}>
          {error => (
            <FormikFieldHelp error>
              <StyledErrorPreLine>{error}</StyledErrorPreLine>
            </FormikFieldHelp>
          )}
        </ErrorMessage>
      ))}
    </>
  );
};

export default VisualElementField;
