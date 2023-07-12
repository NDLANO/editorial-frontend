/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import { useCallback } from 'react';
import config from '../../../../config';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import { HandleSubmitFunc, TopicArticleFormType } from '../../../FormikForm/articleFormHooks';
import { useSession } from '../../../Session/SessionProvider';
import { onSaveAsVisualElement } from '../../../FormikForm/utils';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';
import RevisionNotes from '../../components/RevisionNotes';
import FormAccordions from '../../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../../components/Accordion/FormAccordion';

interface Props {
  handleSubmit: HandleSubmitFunc<TopicArticleFormType>;
  article?: IArticle;
  taxonomy?: ArticleTaxonomy;
  updateNotes: (art: IUpdatedArticle) => Promise<IArticle>;
  articleLanguage: string;
}

const TopicArticleAccordionPanels = ({
  handleSubmit,
  article,
  updateNotes,
  articleLanguage,
  taxonomy,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<TopicArticleFormType>();

  const onSubmit = useCallback(
    () => handleSubmit(formikContext.values, formikContext),
    [formikContext, handleSubmit],
  );

  const { values, errors } = formikContext;
  return (
    <FormAccordions defaultOpen={['topic-article-content']}>
      <FormAccordion
        id={'topic-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content || errors.visualElement)}
      >
        <TopicArticleContent handleSubmit={onSubmit} values={values} />
      </FormAccordion>
      {article && taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <FormAccordion
          id={'topic-article-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}
          hasError={false}
        >
          <TopicArticleTaxonomy article={article} updateNotes={updateNotes} taxonomy={taxonomy} />
        </FormAccordion>
      )}
      <FormAccordion
        id={'topic-article-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }
      >
        <CopyrightFieldGroup enableLicenseNA />
      </FormAccordion>
      <FormAccordion
        id={'topic-article-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.tags)}
      >
        <MetaDataField
          articleLanguage={articleLanguage}
          showCheckbox={true}
          checkboxAction={(image) => onSaveAsVisualElement(image, formikContext)}
        />
      </FormAccordion>
      <FormAccordion
        id={'topic-article-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}
      >
        <GrepCodesField />
      </FormAccordion>
      {config.ndlaEnvironment === 'test' && (
        <FormAccordion
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}
        >
          <RelatedContentFieldGroup />
        </FormAccordion>
      )}
      <FormAccordion
        id={'topic-article-revisions'}
        title={t('form.name.revisions')}
        className={'u-6/6'}
        hasError={!!errors.revisionMeta || !!errors.revisionError}
      >
        <RevisionNotes />
      </FormAccordion>
      {article && (
        <FormAccordion
          id={'topic-article-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}
        >
          <VersionAndNotesPanel
            article={article}
            type="topic-article"
            currentLanguage={values.language}
          />
        </FormAccordion>
      )}
    </FormAccordions>
  );
};

export default TopicArticleAccordionPanels;
