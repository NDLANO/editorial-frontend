import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useFormikContext } from 'formik';
import { LocaleContext } from '../../../App/App';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import { ArticleShape, LicensesArrayOf } from '../../../../shapes';

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
}) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const formikContext = useFormikContext();
  const { values, setValues, errors, handleBlur } = formikContext;

  return (
    <Accordions>
      <AccordionSection
        id={'learning-resource-content'}
        title={t('form.contentSection')}
        className={'u-4/6@desktop u-push-1/6@desktop'}
        hasError={!!(errors.slatetitle || errors.introduction || errors.content)}
        startOpen>
        <LearningResourceContent
          userAccess={userAccess}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          values={values}
          article={article}
          locale={locale}
        />
      </AccordionSection>
      {values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
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
        <GrepCodesField article={article} />
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
            values={values}
            formIsDirty={formIsDirty}
            setValues={setValues}
            getArticle={getArticle}
            article={article}
            getInitialValues={getInitialValues}
            createMessage={createMessage}
            history={history}
          />
        </AccordionSection>
      )}
    </Accordions>
  );
};

LearningResourcePanels.propTypes = {
  userAccess: PropTypes.string,
  fetchSearchTags: PropTypes.func.isRequired,
  article: ArticleShape.isRequired,
  updateNotes: PropTypes.func,
  licenses: LicensesArrayOf,
  getArticle: PropTypes.func,
  getInitialValues: PropTypes.func,
  createMessage: PropTypes.func,
  history: PropTypes.object,
  formIsDirty: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
};

export default LearningResourcePanels;
