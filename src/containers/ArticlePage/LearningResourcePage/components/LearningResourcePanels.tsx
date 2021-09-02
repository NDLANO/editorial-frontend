import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FormikHelpers, useFormikContext } from 'formik';
import { LocaleContext } from '../../../App/App';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import { ConvertedDraftType, License, SearchResult } from '../../../../interfaces';
import { ArticleFormikType } from '../../../FormikForm/articleFormHooks';
import { NewReduxMessage } from '../../../Messages/messagesSelectors';
import { UpdatedDraftApiType } from '../../../../modules/draft/draftApiInterfaces';

interface Props extends RouteComponentProps {
  userAccess?: string;
  fetchSearchTags: (input: string, language: string) => Promise<SearchResult>;
  handleSubmit: (
    values: ArticleFormikType,
    formikHelpers: FormikHelpers<ArticleFormikType>,
  ) => Promise<void>;
  article: Partial<ConvertedDraftType>;
  formIsDirty: boolean;
  createMessage: (message: NewReduxMessage) => void;
  getInitialValues: (article: Partial<ConvertedDraftType>) => ArticleFormikType;
  licenses: License[];
  updateNotes: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  getArticle: (preview: boolean) => UpdatedDraftApiType;
}

const LearningResourcePanels = ({
  userAccess,
  fetchSearchTags,
  article,
  updateNotes,
  licenses,
  getArticle,
  getInitialValues,
  createMessage,
  history,
  formIsDirty,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const formikContext = useFormikContext<ArticleFormikType>();
  const { values, setValues, errors, handleBlur } = formikContext;

  const showTaxonomySection = !!values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE);

  return (
    <Accordions>
      <AccordionSection
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.slatetitle || errors.introduction || errors.content)}
        startOpen>
        <LearningResourceContent
          formik={formikContext}
          userAccess={userAccess}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          values={values}
          article={article}
          locale={locale}
        />
      </AccordionSection>
      {showTaxonomySection && (
        <AccordionSection
          id={'learning-resource-taxonomy'}
          title={t('form.taxonomySection')}
          className={'u-6/6'}>
          <LearningResourceTaxonomy
            userAccess={userAccess}
            article={article}
            locale={locale}
            updateNotes={updateNotes}
          />
        </AccordionSection>
      )}
      <AccordionSection
        id={'learning-resource-copyright'}
        title={t('form.copyrightSection')}
        className={'u-6/6'}
        hasError={
          !!(errors.creators || errors.rightsholders || errors.processors || errors.license)
        }>
        <CopyrightFieldGroup values={values} licenses={licenses} />
      </AccordionSection>
      <AccordionSection
        id={'learning-resource-metadata'}
        title={t('form.metadataSection')}
        className={'u-6/6'}
        hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}>
        <MetaDataField
          handleBlur={handleBlur}
          fetchSearchTags={fetchSearchTags}
          handleSubmit={handleSubmit}
          article={article}
        />
      </AccordionSection>
      <AccordionSection
        id={'learning-resource-grepCodes'}
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
          id={'learning-resource-workflow'}
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

export default withRouter(LearningResourcePanels);
