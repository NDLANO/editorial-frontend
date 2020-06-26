/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { TranslateType } from '../../../interfaces';
import TopicArticleVisualElement from '../../TopicArticlePage/components/TopicArticleVisualElement';
import FormikField from '../../../components/FormikField';
import StyledFormContainer from '../../../components/SlateEditor/common/StyledFormContainer';

interface Props {
  t: TranslateType;
}

const SubjectFrontpageAbout: FC<Props> = ({ t }) => {
  return (
    <>
      <FormikField
        label={t('subjectFrontpageForm.subjectName')}
        name="aboutTitle"
        title
        noBorder
        placeholder={t('subjectFrontpageForm.subjectName')}
      />
      <StyledFormContainer>
        <FormikField
          label={t('subjectFrontpageForm.description')}
          name="description"
          noBorder
          placeholder={t('subjectFrontpageForm.description')}
          maxLength={800}
          multiline
        />
      </StyledFormContainer>
      <TopicArticleVisualElement />
    </>
  );
};

export default injectT(SubjectFrontpageAbout);
