import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useFormikContext } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import { LocaleContext } from '../../../App/App';
import { TopicArticleFormikType } from '../../../FormikForm/articleFormHooks';
import { ConvertedDraftType, License, SearchResult } from '../../../../interfaces';
import { NewReduxMessage } from '../../../Messages/messagesSelectors';
import { UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';

interface Props extends RouteComponentProps {
  userAccess: string | undefined;
  fetchSearchTags: (input: string, language: string) => Promise<SearchResult>;
  handleSubmit: () => Promise<void>;
  article: Partial<ConvertedDraftType>;
  formIsDirty: boolean;
  updateNotes: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  getArticle: () => UpdatedDraftApiType;
  licenses: License[];
  createMessage: (message: NewReduxMessage) => void;
  getInitialValues: (article: Partial<ConvertedDraftType>) => TopicArticleFormikType;
}

const TopicArticleAccordionPanels = ({
  userAccess,
  fetchSearchTags,
  handleSubmit,
  article,
  formIsDirty,
  updateNotes,
  licenses,
  history,
  createMessage,
  getInitialValues,
  getArticle,
}: Props) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const formikContext = useFormikContext<TopicArticleFormikType>();
  const { values, handleBlur, errors, setValues } = formikContext;
  return (
    <Accordions>
      <AccordionSection
        id={'topic-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={
          !!(
            errors.slatetitle ||
            errors.introduction ||
            errors.content ||
            errors.visualElementObject
          )
        }
        startOpen>
        <TopicArticleContent
          userAccess={userAccess}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          values={values}
        />
      </AccordionSection>
      {values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
        <AccordionSection
          id={'topic-article-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <TopicArticleTaxonomy
            articleId={values.id}
            article={article}
            locale={locale}
            updateNotes={updateNotes}
          />
        </AccordionSection>
      )}
      <AccordionSection
        id={'topic-article-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }>
        <CopyrightFieldGroup values={values} licenses={licenses} />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.tags)}>
        <MetaDataField article={article} fetchSearchTags={fetchSearchTags} />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}>
        <GrepCodesField grepCodes={article.grepCodes ?? []} />
      </AccordionSection>
      {!!userAccess?.includes(DRAFT_ADMIN_SCOPE) && (
        <AccordionSection
          id={'learning-resource-related'}
          title={t('form.name.relatedContent')}
          className={'u-6/6'}
          hasError={!!(errors.conceptIds || errors.relatedContent)}>
          <RelatedContentFieldGroup values={values} locale={locale} />
        </AccordionSection>
      )}
      {values.id && (
        <AccordionSection
          id={'topic-article-workflow'}
          title={t('form.workflowSection')}
          className={'u-6/6'}
          hasError={!!errors.notes}>
          <VersionAndNotesPanel
            article={article}
            articleId={values.id}
            createMessage={createMessage}
            getArticle={getArticle}
            getInitialValues={getInitialValues}
            setValues={setValues}
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

export default withRouter(TopicArticleAccordionPanels);
