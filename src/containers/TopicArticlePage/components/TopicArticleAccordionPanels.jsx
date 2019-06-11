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
  FormikWorkflow,
  FormikMetadata,
} from '../../FormikForm';

const panels = [
  {
    id: 'topic-article-content',
    title: 'form.contentSection',
    className: 'u-4/6@desktop u-push-1/6@desktop',
    errorFields: [
      'title',
      'introduction',
      'content',
      'visualElement',
      'visualElement.alt',
      'visualElement.caption',
    ],
    component: props => <TopicArticleContent {...props} />,
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
    id: 'topic-article-workflow',
    title: 'form.workflowSection',
    className: 'u-6/6',
    errorFields: ['notes'],
    component: props => <FormikWorkflow {...props} />,
  },
];

const TopicArticleAccordionPanels = ({ t, errors, touched, ...rest }) => (
  <Accordion openIndexes={['topic-article-content']}>
    {({ openIndexes, handleItemClick }) => (
      <AccordionWrapper>
        {panels.map(panel => {
          const hasError = panel.errorFields.some(
            field => !!errors[field] && touched[field],
          );
          return (
            <Fragment key={panel.id}>
              <AccordionBar
                panelId={panel.id}
                ariaLabel={t(panel.title)}
                onClick={() => handleItemClick(panel.id)}
                hasError={hasError}
                isOpen={openIndexes.includes(panel.id)}>
                {t(panel.title)}
              </AccordionBar>
              {openIndexes.includes(panel.id) && (
                <AccordionPanel
                  id={panel.id}
                  hasError={hasError}
                  isOpen={openIndexes.includes(panel.id)}>
                  <div className={panel.className}>
                    {panel.component({ hasError, ...rest })}
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
};

export default injectT(TopicArticleAccordionPanels);
