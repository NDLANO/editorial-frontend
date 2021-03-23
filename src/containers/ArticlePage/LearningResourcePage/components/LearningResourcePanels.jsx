import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Accordion, { AccordionWrapper } from '@ndla/accordion';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import AccordionSection from '../../../ConceptPage/ConceptForm/AccordionSection';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';

const LearningResourcePanels = ({
  t,
  values,
  userAccess,
  errors,
  fetchSearchTags,
  handleSubmit,
  ...rest
}) => (
  <Accordion>
    {({ handleItemClick }) => (
      <AccordionWrapper>
        <AccordionSection
          id={'learning-resource-content'}
          title={t('form.contentSection')}
          className={'u-4/6@desktop u-push-1/6@desktop'}
          hasError={!!(errors.title || errors.introduction || errors.content)}
          startOpen>
          <LearningResourceContent userAccess={userAccess} handleSubmit={handleSubmit} {...rest} />
        </AccordionSection>
        {values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
          <AccordionSection
            id={'learning-resource-taxonomy'}
            title={t('form.taxonomySection')}
            className={'u-6/6'}>
            <LearningResourceTaxonomy
              closePanel={() => handleItemClick('topic-article-taxonomy')}
              userAccess={userAccess}
              {...rest}
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
          <CopyrightFieldGroup values={values} {...rest} />
        </AccordionSection>
        <AccordionSection
          id={'learning-resource-metadata'}
          title={t('form.metadataSection')}
          className={'u-6/6'}
          hasError={!!(errors.metaDescription || errors.metaImageAlt || errors.tags)}>
          <MetaDataField fetchSearchTags={fetchSearchTags} handleSubmit={handleSubmit} {...rest} />
        </AccordionSection>
        <AccordionSection
          id={'learning-resource-grepCodes'}
          title={t('form.name.grepCodes')}
          className={'u-6/6'}
          hasError={!!errors.grepCodes}>
          <GrepCodesField {...rest} />
        </AccordionSection>
        {!!userAccess?.includes(DRAFT_ADMIN_SCOPE) && (
          <AccordionSection
            id={'learning-resource-related'}
            title={t('form.name.relatedContent')}
            className={'u-6/6'}
            hasError={!!(errors.conceptIds || errors.relatedContent)}>
            <RelatedContentFieldGroup values={values} {...rest} />
          </AccordionSection>
        )}
        {values.id && (
          <AccordionSection
            id={'learning-resource-workflow'}
            title={t('form.workflowSection')}
            className={'u-6/6'}
            hasError={!!errors.notes}>
            <VersionAndNotesPanel values={values} {...rest} />}
          </AccordionSection>
        )}
      </AccordionWrapper>
    )}
  </Accordion>
);

LearningResourcePanels.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  userAccess: PropTypes.string,
  article: PropTypes.shape({
    grepCodes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  fetchSearchTags: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default injectT(LearningResourcePanels);
