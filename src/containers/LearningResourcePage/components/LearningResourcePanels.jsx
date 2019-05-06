import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import LearningResourceTaxonomy from './LearningResourceTaxonomy';
import LearningResourceContent from './LearningResourceContent';
import LearningResourceMetadata from './LearningResourceMetadata';
import { FormikCopyright, FormikWorkflow } from '../../FormikForm';
import config from '../../../config';

const panels = [
  {
    id: 'learning-resource-content',
    title: 'form.contentSection',
    className: 'u-4/6@desktop u-push-1/6@desktop',
    errorFields: ['title', 'introduction', 'content'],
    component: props => <LearningResourceContent {...props} />,
  },
  {
    id: 'learning-resource-taxonomy',
    title: 'form.taxonomytSection',
    errorFields: [],
    showPanel: (values, userAccess) =>
      values.id &&
      ((userAccess &&
        userAccess.includes(`taxonomy-${config.ndlaEnvironment}:write`)) ||
        userAccess.includes('taxonomy:write')),
    className: 'u-6/6',
    component: props => <LearningResourceTaxonomy {...props} />,
  },
  {
    id: 'learning-resource-copyright',
    title: 'form.copyrightSection',
    className: 'u-6/6',
    errorFields: ['creators', 'rightsholders', 'processors', 'license'],
    component: props => <FormikCopyright {...props} />,
  },
  {
    id: 'learning-resource-metadata',
    title: 'form.metadataSection',
    className: 'u-6/6',
    errorFields: ['metaDescription', 'metaImageAlt', 'tags'],
    component: props => <LearningResourceMetadata {...props} />,
  },
  {
    id: 'learning-resource-workflow',
    title: 'form.workflowSection',
    className: 'u-6/6',
    errorFields: ['notes'],
    component: props => <FormikWorkflow {...props} />,
  },
];

const LearningResourcePanels = ({
  t,
  values,
  userAccess,
  errors,
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
                hasError={hasError}
                isOpen={openIndexes.includes(panel.id)}>
                {t(panel.title)}
              </AccordionBar>
              {openIndexes.includes(panel.id) && (
                <AccordionPanel
                  id={panel.id}
                  hasError={panel.hasError}
                  isOpen={openIndexes.includes(panel.id)}>
                  <div className={panel.className}>
                    {panel.component({ hasError, values, ...rest })}
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

LearningResourcePanels.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  userAccess: PropTypes.string,
};

export default injectT(LearningResourcePanels);
