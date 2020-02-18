import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import TopicArticleContent from './TopicArticleContent';
import {
  FormikCopyright,
  VersionAndNotesPanel,
  FormikMetadata,
} from '../../FormikForm';
import TopicArticleTaxonomy from './TopicArticleTaxonomy';
import { TAXONOMY_WRITE_SCOPE } from '../../../constants';
import FormikCompetences from '../../FormikForm/FormikCompetences';

const panels = [
  {
    id: 'topic-article-content',
    title: 'form.contentSection',
    className: 'u-4/6@desktop u-push-1/6@desktop',
    errorFields: ['title', 'introduction', 'content', 'visualElement'],
    component: props => <TopicArticleContent {...props} />,
  },
  {
    id: 'topic-article-taxonomy',
    title: 'form.taxonomytSection',
    errorFields: [],
    showPanel: (values, userAccess) =>
      values.id && (userAccess && userAccess.includes(TAXONOMY_WRITE_SCOPE)),
    className: 'u-6/6',
    component: props => <TopicArticleTaxonomy {...props} />,
  },
  {
    id: 'topic-article-copyright',
    title: 'form.copyrightSection',
    className: 'u-6/6',
    errorFields: ['creators', 'rightsholders', 'processors', 'license'],
    component: props => <FormikCopyright {...props} />,
  },
  {
    id: 'topic-article-metadata',
    title: 'form.metadataSection',
    className: 'u-6/6',
    errorFields: ['metaDescription', 'tags'],
    component: props => <FormikMetadata {...props} />,
  },
  {
    id: 'topic-article-competences',
    title: 'form.name.competences',
    className: 'u-6/6',
    errorFields: ['competences'],
    component: props => <FormikCompetences {...props} />,
  },
  {
    id: 'topic-article-workflow',
    title: 'form.workflowSection',
    className: 'u-6/6',
    errorFields: ['notes'],
    showPanel: values => values.id,
    component: props => <VersionAndNotesPanel {...props} />,
  },
];

const TopicArticleAccordionPanels = ({
  t,
  errors,
  values,
  userAccess,
  touched,
  ...rest
}) => (
  <Accordion openIndexes={['topic-article-content']}>
    {({ openIndexes, handleItemClick }) => (
      <AccordionWrapper>
        {panels.map(panel => {
          if (panel.showPanel && !panel.showPanel(values, userAccess)) {
            return null;
          }
          const hasError = panel.errorFields.some(
            field => !!errors[field] && touched[field],
          );
          return (
            <Fragment key={panel.id}>
              <AccordionBar
                panelId={panel.id}
                ariaLabel={t(panel.title)}
                onClick={() => handleItemClick(panel.id)}
                title={t(panel.title)}
                hasError={hasError}
                isOpen={openIndexes.includes(panel.id)}
              />
              {openIndexes.includes(panel.id) && (
                <AccordionPanel
                  id={panel.id}
                  hasError={hasError}
                  isOpen={openIndexes.includes(panel.id)}>
                  <div className={panel.className}>
                    {panel.component({
                      hasError,
                      values,
                      userAccess,
                      closePanel: () => handleItemClick(panel.id),
                      ...rest,
                    })}
                  </div>
                </AccordionPanel>
              )}
            </Fragment>
          );
        })}
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
};

export default injectT(TopicArticleAccordionPanels);
