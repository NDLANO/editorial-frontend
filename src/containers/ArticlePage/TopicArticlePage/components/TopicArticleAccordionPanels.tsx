/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useFormikContext } from 'formik';
import config from '../../../../config';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import { TopicArticleFormType } from '../../../FormikForm/articleFormHooks';
import { DraftApiType, UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';
import { useSession } from '../../../Session/SessionProvider';
import { onSaveAsVisualElement } from '../../../FormikForm/utils';
import { ArticleTaxonomy } from '../../../FormikForm/formikDraftHooks';

interface Props {
  handleSubmit: () => Promise<void>;
  article?: DraftApiType;
  taxonomy?: ArticleTaxonomy;
  updateNotes: (art: UpdatedDraftApiType) => Promise<DraftApiType>;
  getArticle: () => UpdatedDraftApiType;
  articleLanguage: string;
}

const TopicArticleAccordionPanels = ({
  handleSubmit,
  article,
  updateNotes,
  getArticle,
  articleLanguage,
  taxonomy,
}: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const formikContext = useFormikContext<TopicArticleFormType>();
  const { values, errors, setValues, setStatus } = formikContext;
  return (
    <Accordions>
      <AccordionSection
        id={'topic-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.title || errors.introduction || errors.content || errors.visualElement)}
        startOpen>
        <TopicArticleContent handleSubmit={handleSubmit} values={values} />
      </AccordionSection>
      {article && taxonomy && !!userPermissions?.includes(TAXONOMY_WRITE_SCOPE) && (
        <AccordionSection
          id={'topic-article-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <TopicArticleTaxonomy article={article} updateNotes={updateNotes} taxonomy={taxonomy} />
        </AccordionSection>
      )}
      <AccordionSection
        id={'topic-article-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }>
        <CopyrightFieldGroup values={values} enableLicenseNA={true} />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.tags)}>
        <MetaDataField
          articleLanguage={articleLanguage}
          showCheckbox={true}
          checkboxAction={image => onSaveAsVisualElement(image, formikContext)}
        />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}>
        <GrepCodesField />
      </AccordionSection>
      {config.ndlaEnvironment === 'test' && (
        <AccordionSection
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}>
          <RelatedContentFieldGroup />
        </AccordionSection>
      )}
      {article && (
        <AccordionSection
          id={'topic-article-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            getArticle={getArticle}
            setValues={setValues}
            setStatus={setStatus}
            type="topic-article"
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default TopicArticleAccordionPanels;
