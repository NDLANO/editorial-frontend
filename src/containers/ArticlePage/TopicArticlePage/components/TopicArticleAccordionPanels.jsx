import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useFormikContext } from 'formik';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import { ArticleShape, LicensesArrayOf } from '../../../../shapes';
import { LocaleContext } from '../../../App/App';

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
}) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const formikContext = useFormikContext();
  const { values, handleBlur, errors, setValues } = formikContext;
  return (
    <Accordions>
      <AccordionSection
        id={'topic-article-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={
          !!(errors.slatetitle || errors.introduction || errors.content || errors.visualElement)
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
          <TopicArticleTaxonomy article={article} locale={locale} updateNotes={updateNotes} />
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
        <MetaDataField
          article={article}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          fetchSearchTags={fetchSearchTags}
        />
      </AccordionSection>
      <AccordionSection
        id={'topic-article-grepCodes'}
        title={t('form.name.grepCodes')}
        className={'u-6/6'}
        hasError={!!errors.grepCodes}>
        <GrepCodesField grepCodes={article.grepCodes} />
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
            formIsDirty={formIsDirty}
            setValues={setValues}
            getArticle={getArticle}
            getInitialValues={getInitialValues}
            createMessage={createMessage}
            history={history}
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

TopicArticleAccordionPanels.propTypes = {
  userAccess: PropTypes.string,
  fetchSearchTags: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  article: ArticleShape,
  formIsDirty: PropTypes.bool,
  updateNotes: PropTypes.func,
  licenses: LicensesArrayOf,
  history: PropTypes.object,
  createMessage: PropTypes.func,
  getArticle: PropTypes.func,
  getInitialValues: PropTypes.func,
};

export default TopicArticleAccordionPanels;
