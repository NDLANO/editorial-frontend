/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React from 'react';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { injectT, tType } from '@ndla/i18n';
import { FormikErrors } from 'formik';
import SubjectpageAbout from './SubjectpageAbout';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageArticles from './SubjectpageArticles';
import { ArticleType, FormikProperties } from '../../../interfaces';
import FormikField from '../../../components/FormikField';
import { SubjectFormValues } from './SubjectpageForm';

interface Props {
  editorsChoices: ArticleType[];
  elementId: string;
  errors: FormikErrors<SubjectFormValues>;
}

const SubjectpageAccordionPanels = ({ t, editorsChoices, elementId, errors }: Props & tType) => {
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

export default injectT(SubjectpageAccordionPanels);
