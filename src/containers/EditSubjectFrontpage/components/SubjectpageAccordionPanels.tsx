/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useTranslation } from 'react-i18next';
import { FormikErrors } from 'formik';
import { IArticle } from '@ndla/types-draft-api';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';
import SubjectpageAbout from './SubjectpageAbout';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageArticles from './SubjectpageArticles';
import { FormikProperties } from '../../../interfaces';
import FormikField from '../../../components/FormikField';
import { SubjectPageFormikType } from '../../../util/subjectHelpers';

interface Props {
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  errors: FormikErrors<SubjectPageFormikType>;
}

const SubjectpageAccordionPanels = ({ editorsChoices, elementId, errors }: Props) => {
  const { t } = useTranslation();
  return (
    <Accordions>
      <AccordionSection
        id="about"
        title={t('subjectpageForm.about')}
        className="u-4/6@desktop u-push-1/6@desktop"
        hasError={['title', 'description', 'visualElement'].some(field => field in errors)}
        startOpen>
        <SubjectpageAbout />
      </AccordionSection>
      <AccordionSection
        id="metadata"
        title={t('subjectpageForm.metadata')}
        className="u-6/6"
        hasError={['metaDescription', 'mobileBannerId'].some(field => field in errors)}>
        <SubjectpageMetadata />
      </AccordionSection>
      <AccordionSection
        id="articles"
        title={t('subjectpageForm.articles')}
        className="u-6/6"
        hasError={['editorsChoices'].some(field => field in errors)}>
        <FormikField name={'editorsChoices'}>
          {({ field, form }: FormikProperties) => (
            <SubjectpageArticles
              editorsChoices={editorsChoices}
              elementId={elementId}
              field={field}
              form={form}
            />
          )}
        </FormikField>
      </AccordionSection>
    </Accordions>
  );
};

export default SubjectpageAccordionPanels;
