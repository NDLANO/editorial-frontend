/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { FormikHelpers, useFormikContext } from 'formik';
import { IArticle } from '@ndla/types-backend/draft-api';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import { FrontpageArticleFormType } from '../../../FormikForm/articleFormHooks';
import RevisionNotes from '../../components/RevisionNotes';
import FrontpageArticleFormContent from './FrontpageArticleFormContent';
import FormAccordions from '../../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../../components/Accordion/FormAccordion';

interface Props {
  handleSubmit: (
    values: FrontpageArticleFormType,
    formikHelpers: FormikHelpers<FrontpageArticleFormType>,
  ) => Promise<void>;
  article?: IArticle;
  articleLanguage: string;
}

const FrontpageArticlePanels = ({ article, handleSubmit, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<FrontpageArticleFormType>();
  const { values, errors, handleBlur } = formikContext;

  return (
    <FormAccordions defaultOpen={['frontpage-article-content']}>
      <FormAccordion
        id={'frontpage-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
      >
        <FrontpageArticleFormContent
          articleLanguage={articleLanguage}
          formik={formikContext}
          handleSubmit={() => handleSubmit(values, formikContext)}
          handleBlur={handleBlur}
          values={values}
        />
      </FormAccordion>
      <FormAccordion
        id={'frontpage-article-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }
      >
        <CopyrightFieldGroup />
      </FormAccordion>
      <FormAccordion
        id={'frontpage-article-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
      >
        <MetaDataField articleLanguage={articleLanguage} />
      </FormAccordion>
      <FormAccordion
        id={'frontpage-article-revisions'}
        title={t('form.name.revisions')}
        className={'u-6/6'}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion
          id={'frontpage-article-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}
        >
          <VersionAndNotesPanel
            article={article}
            type="standard"
            currentLanguage={articleLanguage}
          />
        </FormAccordion>
      )}
    </FormAccordions>
  );
};

export default FrontpageArticlePanels;
