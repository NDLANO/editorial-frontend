/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { FormikHelpers, useFormikContext } from 'formik';
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import { FrontpageArticleFormType } from '../../../FormikForm/articleFormHooks';
import RevisionNotes from '../../components/RevisionNotes';
import FrontpageArticleFormContent from './FrontpageArticleFormContent';
import { FlexWrapper, MainContent } from '../../styles';
import CommentSection from '../../components/CommentSection';

interface Props {
  handleSubmit: (
    values: FrontpageArticleFormType,
    formikHelpers: FormikHelpers<FrontpageArticleFormType>,
  ) => Promise<void>;
  article?: IArticle;
  getArticle: (preview: boolean) => IUpdatedArticle;
  articleLanguage: string;
}

const FrontpageArticlePanels = ({ article, getArticle, handleSubmit, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<FrontpageArticleFormType>();
  const { values, errors, handleBlur } = formikContext;

  return (
    <FlexWrapper>
      <MainContent>
        <Accordions>
          <AccordionSection
            id={'frontpage-article-content'}
            title={t('form.contentSection')}
            className={'u-4/6@desktop u-push-1/6@desktop'}
            hasError={!!(errors.title || errors.introduction || errors.content)}
            startOpen
          >
            <FrontpageArticleFormContent
              articleLanguage={articleLanguage}
              formik={formikContext}
              handleSubmit={() => handleSubmit(values, formikContext)}
              handleBlur={handleBlur}
              values={values}
            />
          </AccordionSection>
          <AccordionSection
            id={'frontpage-article-copyright'}
            title={t('form.copyrightSection')}
            className={'u-6/6'}
            hasError={
              !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
            }
          >
            <CopyrightFieldGroup values={values} />
          </AccordionSection>
          <AccordionSection
            id={'frontpage-article-metadata'}
            title={t('form.metadataSection')}
            className={'u-6/6'}
            hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}
          >
            <MetaDataField articleLanguage={articleLanguage} />
          </AccordionSection>
          <AccordionSection
            id={'frontpage-article-revisions'}
            title={t('form.name.revisions')}
            className={'u-6/6'}
            hasError={!!errors.revisionMeta || !!errors.revisionError}
          >
            <RevisionNotes />
          </AccordionSection>

          {article && (
            <AccordionSection
              id={'frontpage-article-workflow'}
              title={t('form.workflowSection')}
              className={'u-6/6'}
              hasError={!!errors.notes}
            >
              <VersionAndNotesPanel
                article={article}
                getArticle={getArticle}
                type="standard"
                currentLanguage={values.language}
              />
            </AccordionSection>
          )}
        </Accordions>
      </MainContent>
      <CommentSection savedComments={article?.comments} savedStatus={article?.status} />
    </FlexWrapper>
  );
};

export default FrontpageArticlePanels;
