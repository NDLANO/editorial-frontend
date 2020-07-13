/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { TranslateType } from '../../../interfaces';
import FormikField from '../../../components/FormikField';
import StyledFormContainer from '../../../components/SlateEditor/common/StyledFormContainer';
import FormikVisualElement from '../../FormikForm/FormikVisualElement';

interface Props {
  t: TranslateType;
}

const SubjectpageAbout: FC<Props> = ({ t }) => {
  return (
    <>
      <FormikField
        label={t('subjectpageForm.subjectName')}
        name="about.title"
        title
        noBorder
        placeholder={t('subjectpageForm.subjectName')}
      />
      <StyledFormContainer>
        <FormikField
          label={t('subjectpageForm.description')}
          name="about.description"
          noBorder
          placeholder={t('subjectpageForm.description')}
          maxLength={800}
        />
      </StyledFormContainer>
      <FormikVisualElement
        name={"about.visualElement"}
      />
    </>
  );
};

export default injectT(SubjectpageAbout);
