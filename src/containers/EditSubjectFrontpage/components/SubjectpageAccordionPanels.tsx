/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { FormikErrors } from 'formik';
import { IArticle } from '@ndla/types-backend/draft-api';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import SubjectpageAbout from './SubjectpageAbout';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageArticles from './SubjectpageArticles';
import FormikField from '../../../components/FormikField';
import { SubjectPageFormikType } from '../../../util/subjectHelpers';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../components/Accordion/FormAccordion';

interface Props {
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  errors: FormikErrors<SubjectPageFormikType>;
}

const SubjectpageAccordionPanels = ({ editorsChoices, elementId, errors }: Props) => {
  const { t } = useTranslation();

  const SubjectPageArticle = () => (
    <SubjectpageArticles
      editorsChoices={editorsChoices}
      elementId={elementId}
      fieldName={'editorsChoices'}
    />
  );

  return (
    <FormAccordions defaultOpen={['about']}>
      <FormAccordion
        id="about"
        title={t('subjectpageForm.about')}
        className="u-4/6@desktop u-push-1/6@desktop"
        hasError={['title', 'description', 'visualElement'].some((field) => field in errors)}
      >
        <SubjectpageAbout />
      </FormAccordion>
      <FormAccordion
        id="metadata"
        title={t('subjectpageForm.metadata')}
        className="u-6/6"
        hasError={['metaDescription', 'mobileBannerId'].some((field) => field in errors)}
      >
        <SubjectpageMetadata />
      </FormAccordion>
      <FormAccordion
        id="articles"
        title={t('subjectpageForm.articles')}
        className="u-6/6"
        hasError={['editorsChoices'].some((field) => field in errors)}
      >
        <FormikField name={'editorsChoices'}>{SubjectPageArticle}</FormikField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
