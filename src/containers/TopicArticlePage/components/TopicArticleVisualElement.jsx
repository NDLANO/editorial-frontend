/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { connect } from 'formik';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementMenu from '../../VisualElement/VisualElementMenu';
import VisualElementPreview from '../../VisualElement/VisualElementPreview';
import { CommonFieldPropsShape } from '../../../shapes';
import FormikField from '../../../components/FormikField';

export const visualElementClasses = new BEMHelper({
  name: 'visual-element',
  prefix: 'c-',
});

class TopicArticleVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResource: undefined,
    };
    this.handleSelectResource = this.handleSelectResource.bind(this);
    this.resetSelectedResource = this.resetSelectedResource.bind(this);
  }

  resetSelectedResource() {
    this.setState({ selectedResource: undefined });
  }

  handleSelectResource(selectedResource) {
    this.setState({ selectedResource });
  }

  render() {
    const { t, bindInput, commonFieldProps } = this.props;
    // const { schema, submitted } = commonFieldProps;
    const visualElement = {};
    //const bindInputVisualElement = bindInput('visualElement');
    //const { value: visualElement } = bindInputVisualElement;
    return (
      <div>
        <div {...visualElementClasses('add-title')}>
          <span>
            {t('form.visualElement.title')}
            <div {...visualElementClasses('add-title', 'border')} />
          </span>
        </div>
        {!visualElement.resource ? (
          <VisualElementMenu onSelect={this.handleSelectResource} />
        ) : null}
        <FormikField name="visualElement">
          {({ field }) => (
            <Fragment>
              <VisualElementPreview
                label={t('form.visualElement.label')}
                changeVisualElement={this.handleSelectResource}
                resetSelectedResource={this.resetSelectedResource}
                {...field}
              />
              <VisualElementSelectField
                selectedResource={this.state.selectedResource}
                resetSelectedResource={this.resetSelectedResource}
                {...field}
              />
            </Fragment>
          )}
        </FormikField>
        {visualElement.resource && visualElement.resource !== 'h5p' ? (
          <div>
            <FormikField
              placeholder={t(
                `topicArticleForm.fields.caption.placeholder.${
                  visualElement.resource
                }`,
              )}
              label={t(
                `topicArticleForm.fields.caption.label.${
                  visualElement.resource
                }`,
              )}
              name="visualElement.caption"
              noBorder
              maxLength={300}
            />
            {visualElement.resource === 'image' && (
              <FormikField
                placeholder={t('topicArticleForm.fields.alt.placeholder')}
                label={t('topicArticleForm.fields.alt.label')}
                name="visualElement.alt"
                noBorder
                maxLength={300}
              />
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

TopicArticleVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  visualElement: PropTypes.shape({
    caption: PropTypes.string,
    alt: PropTypes.string,
    id: PropTypes.string,
    resource: PropTypes.string,
  }),
};

export default connect(injectT(TopicArticleVisualElement));
