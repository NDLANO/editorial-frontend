/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { IArticle } from '@ndla/types-backend/draft-api';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import { FrontpageArticleFormType } from '../../../FormikForm/articleFormHooks';
import RevisionNotes from '../../components/RevisionNotes';
import FrontpageArticleFormContent from './FrontpageArticleFormContent';
import FormAccordions from '../../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../../components/Accordion/FormAccordion';
import { useWideArticle } from '../../../../components/WideArticleEditorProvider';

interface Props {
  article?: IArticle;
  articleLanguage: string;
  initialHTML: string;
}

const FrontpageArticlePanels = ({ article, articleLanguage, initialHTML }: Props) => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<FrontpageArticleFormType>();
  const { isWideArticle } = useWideArticle();

  return (
    <FormAccordions
      defaultOpen={['frontpage-article-content']}
      articleId={article?.id}
      articleType={article?.articleType}
    >
      <FormAccordion
        id={'frontpage-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content)}
        wide={isWideArticle}
        isFrontpageArticle={article?.articleType === 'frontpage-article'}
      >
        <FrontpageArticleFormContent initialHTML={initialHTML} articleLanguage={articleLanguage} />
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
