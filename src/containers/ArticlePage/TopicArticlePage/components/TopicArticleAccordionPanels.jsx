import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Accordion, { AccordionWrapper } from '@ndla/accordion';
import TopicArticleContent from './TopicArticleContent';
import RelatedContentFieldGroup from '../../components/RelatedContentFieldGroup';
import { CopyrightFieldGroup, VersionAndNotesPanel, MetaDataField } from '../../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE, DRAFT_ADMIN_SCOPE } from '../../../../constants';
import GrepCodesField from '../../../FormikForm/GrepCodesField';
import AccordionSection from "../../../ConceptPage/ConceptForm/AccordionSection";


const TopicArticleAccordionPanels = ({
  t,
  errors,
  values,
  userAccess,
  touched,
  fetchSearchTags,
  handleSubmit,
  ...rest
}) => (
  <Accordion>
    {({ handleItemClick }) => (
      <AccordionWrapper>
        <AccordionSection
          id={'topic-article-content'}
          title={t('form.contentSection')}
          className={'u-4/6@desktop u-push-1/6@desktop'}
          hasError={
            !!(errors.title || errors.introduction || errors.content || errors.visualElement)
          }
          startOpen>
          <TopicArticleContent userAccess={userAccess} handleSubmit={handleSubmit} {...rest} />
        </AccordionSection>
        {values.id && !!userAccess?.includes(TAXONOMY_WRITE_SCOPE) && (
          <AccordionSection
            id={'topic-article-taxonomy'}
            title={t('form.taxonomySection')}
            className={'u-6/6'}>
            <TopicArticleTaxonomy
              closePanel={() => handleItemClick('topic-article-taxonomy')}
              userAccess={userAccess}
              {...rest}
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
          <CopyrightFieldGroup values={values} {...rest} />
        </AccordionSection>
        <AccordionSection
          id={'topic-article-metadata'}
          title={t('form.metadataSection')}
          className={'u-6/6'}
          hasError={!!(errors.metaDescription || errors.tags)}>
          <MetaDataField fetchSearchTags={fetchSearchTags} handleSubmit={handleSubmit} {...rest} />
        </AccordionSection>
        <AccordionSection
          id={'topic-article-grepCodes'}
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
            id={'topic-article-workflow'}
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

TopicArticleAccordionPanels.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  userAccess: PropTypes.string,
  fetchSearchTags: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
};

export default injectT(TopicArticleAccordionPanels);
